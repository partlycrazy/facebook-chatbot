'use strict';

require('dotenv').config()

const SampleCashback = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "button",
      "text": "What do you want to do?",
      "buttons": [
        {
          "type": "postback",
          "title": "Check Amount",
          "payload": "checkAmt",
        },
        {
          "type": "postback",
          "title": "Redeem",
          "payload": "genQR",
        }
      ],
    }
  }
}

const UserInput = {
  "text": "Give me an input",
  "quick_replies": [{
    "content_type": "text",
    "title": "Red",
    "payload": "<POSTBACK_PAYLOAD>"
  }]
}


// Imports dependencies and set up http server
const
  request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json()),
  mongoose = require('mongoose'),
  route = require('./routes/route'),
  db = require('./query/queries'),
  cors = require('cors'),
  messageDB = require('./models/flowSchema'),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  MY_VERIFICATION_TOKEN = process.env.MY_VERIFICATION_TOKEN;

var
  queue = [],
  queueProcessing = false;

app.use(express.static('public'));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/message_flow', { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log('Connected to database mongoDB @ 27017')
})

mongoose.connection.on('error', (err) => {
  if (err) {
    console.log(err);
  }
})

app.listen(process.env.PORT || 1500, () => console.log('webhook is listening'));

app.use('/api', route);

app.post('/webhook', (req, res) => {

  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(async function (entry) {
      let webhook_event = entry.messaging[0];
      let sender_psid = webhook_event.sender.id;

      // Check to see if user already exist, if not create new profile
      // Need to improve on tracking outlet_id ... 
      let userPromise = db.getUserByPSID(sender_psid);
      let user = await userPromise;
      if (user.length == 0) {
        newUserProfile(sender_psid);
      }

      let userStatusPromise = db.getUserStatus(sender_psid);
      let userStatus = await userStatusPromise
      userStatus = userStatus[0].status

      console.log(userStatus);



      if (webhook_event.message) {
        if (userStauts !== "default") {
          handleUserInput(sender_psid, webhook_event.message, userStatus)
        } else {
          handleMessage(sender_psid, webhook_event.message);
        }
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

app.get('/webhook', (req, res) => {
  const VERIFY_TOKEN = MY_VERIFICATION_TOKEN;
  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      // Respond with 200 OK and challenge token from the request
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

function handleUserInput(sender_psid, received_message, status) {
  let response;

  if (status == "reedemCashback") {
    response = { "text": `You are reedeming $${received_message.text}` }
    queueRequest(callSendAPI(sender_psid, response));
  }

  db.setUserStatus(sender_psid, "default");
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
  let response;
  // Checks if the message is a text
  if (received_message.text) {


    if (received_message.text === "cashback") {
      response = SampleCashback
      return queueRequest(callSendAPI(sender_psid, response));
    }

    if (received_message.text === "userInput") {
      response = UserInput
      return queueRequest(callSendAPI(sender_psid, response));
    }

    messageDB.findOne({ "keywords": received_message.text }, (err, result) => {
      console.log(result);
      if (err) {
        console.log(err);
      } else {
        if (result) {
          console.log(result);
          var responses = result.content;
          responses.forEach(async (res) => {
            queueRequest(callSendAPI(sender_psid, res.response))
          });
        } else {
          response = {
            "text": "Sorry I did not understand"
          }
          queueRequest(callSendAPI(sender_psid, response));
        }
      }
    })
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [{
            "title": "Is this the right picture?",
            "subtitle": "Tap a button to answer.",
            "image_url": attachment_url,
            "buttons": [
              {
                "type": "postback",
                "title": "Yes!",
                "payload": "yes",
              },
              {
                "type": "postback",
                "title": "No!",
                "payload": "no",
              }
            ],
          }]
        }
      }
    }
  }

  callSendAPI(sender_psid, response);
}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload
  if (payload === 'yes') {
    response = { "text": "Thanks!" }
  } else if (payload === 'no') {
    response = { "text": "Oops, try sending another image." }
  }

  if (payload == "checkAmt") {
    request({
      "uri": `http://localhost:1500/api/data/cashback/${sender_psid}`,
      "method": "GET"
    }, (err, res, body) => {
      if (!err) {
        body = JSON.parse(body);
        response = { "text": `You have $${body[0].sum} of cashback left` }
        return queueRequest(callSendAPI(sender_psid, response));
      }
    })

  } else if (payload === "genQR") {
    response = { "text": "How much do you want to redeem?" }
    db.setUserStatus(sender_psid, "reedemCashback")
  }

  queueRequest(callSendAPI(sender_psid, response));
}

function queueRequest(request) {
  queue.push(request);
  if (queueProcessing) {
    return;
  }
  queueProcessing = true;
  processQueue();
}

function processQueue() {
  if (queue.length == 0) {
    queueProcessing = false;
    return;
  }
  var currentRequest = queue.shift();
  request(currentRequest, (error, response, body) => {
    if (error || response.body.error) {
      console.log("Error sending messages!");
    }
    processQueue();
  });
}

function newUserProfile(sender_psid) {
  var request_info = {
    "uri": `https://graph.facebook.com/${sender_psid}?fields=name&access_token=${PAGE_ACCESS_TOKEN}`,
    "method": "GET"
  }
  request(request_info, (err, response, body) => {
    let user = response.body;
    db.addUser(user)
  })

}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  var request_info = {
    "uri": `https://graph.facebook.com/v6.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`,
    "method": "POST",
    "json": request_body
  }

  return request_info
}
