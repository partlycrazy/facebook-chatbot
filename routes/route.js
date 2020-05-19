const express = require('express');
const router = express.Router();
const messageFlow = require('../models/flowSchema')
const db = require('../query/queries');

router.post('/message_flow', (req, res) => {
    let newFlow = new messageFlow({
        name: req.body.name,
        keywords: req.body.keywords,
        type: req.body.type,
        content: req.body.content
    })
    newFlow.save((err, data) => {
        if (err) {
            res.json({ msg: "failed to add data" })
        } else {
            res.json({ msg: "data added successfully" });
        }
    })
})

router.get('/message_flow/:id', (req, res) => {
    messageFlow.find({ _id: req.params.id }, (err, result) => {
        if (err) {
            res.json({ msg: "error" })
            console.log(err);
        } else {
            res.json(result);
        }
    })
})

router.get('/message_flow', (req, res) => {
    messageFlow.find({}, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    })
})

router.get('/message_flow/data/clear', (req, res) => {
    messageFlow.collection.deleteMany({});
    res.json({ msg: "Database Cleared" });
})

router.delete('/message_flow/delete/:id', (req, res) => {
    messageFlow.deleteOne({_id: req.params.id}, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.json({ msg: "Deleted"})
        }
    })
})

router.post('/message_flow/update/:id', (req, res) => {
    messageFlow.updateOne({ _id: req.params.id }, {
        $set: {
            name: req.body.name,
            keywords: req.body.keywords,
            type: req.body.type,
            content: req.body.content
        }
    }, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    })
})

router.get('/data/user/:psid', db.getUserByPSID)

router.get('/voucher/claim/:voucher_id/:psid', db.claimVoucher)

router.get('/data/cashback/:psid', db.getCashback)

router.get('/data/outlet/:outlet_id', db.getUsersByOutletId)

module.exports = router