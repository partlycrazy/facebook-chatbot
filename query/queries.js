require('dotenv').config({ path: "../.env"})

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.POSTGRESQL_USER,
  host: process.env.POSTGRESQL_HOST,
  database: process.env.POSTGRESQL_DB,
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432,
})

// api/data/outlet/:outlet_id
const getUsersByOutletId = (request, response) => {
    const outlet_id = parseInt(request.params.outlet_id);

    pool.query('SELECT * FROM users WHERE outlet_id = $1', [outlet_id], (err, results) => {
        if(err) {
            console.log(err);
        }
        response.status(200).json(results.rows)
    })
}

function setUserStatus(psid, status) {
    pool.query('UPDATE users SET status = $1 WHERE psid = $2', [status, psid], (err, results) => {
        if (err) {
            console.log(err);
        }
    })
}

async function getUserStatus(psid) {
    statusPromise = await pool.query('SELECT status from users WHERE psid = $1', [psid])
    data = await statusPromise.rows
    return data;
}

function addUser(data) {
    data = JSON.parse(data);
    console.log(data);
    let name = data.name;
    let psid = data.id;
    let outlet_id = 90;

    pool.query('INSERT INTO users (psid, name, outlet_id, status) values ($1,$2,$3, "default")', [psid,name,outlet_id], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            console.log("INSERTED DATA")
        }
    })
}

async function getUserByPSID(psid) {       
    console.log(psid)
    dataPromise = await pool.query('SELECT * FROM users WHERE psid = $1', [psid])
    data = await dataPromise.rows
    return data;
}

const getUser = (request, response) => {
    const psid = parseInt(request.params.psid);
    
    pool.query('SELECT * FROM users WHERE psid = $1', [psid], (err, results) => {
        if (err) {
            console.log(err);
        }
        response.status(200).json(results.rows);
    })
}

// api/voucher/claim/:voucher_id/:psid
const claimVoucher = async (request, response) => {
    const voucher_id = parseInt(request.params.voucher_id);
    const psid = request.params.psid;

    var results = await pool.query('SELECT * FROM vouchers_claim WHERE voucher_id= $1', [voucher_id])
    const claimed = await results.rows
    if (claimed.length > 0) {
        return response.json({msg: "Voucher has been claimed!"});        
    }

    results = await pool.query('SELECT id FROM users WHERE psid = $1', [psid]).catch(err=> console.log(err))
    const user_id = await results.rows[0].id;

    results = await pool.query('SELECT voucher_amt FROM vouchers WHERE voucher_id = $1', [voucher_id]).catch(err=>console.log(err))
    const voucher_amt = await results.rows[0].voucher_amt;

    pool.query('INSERT INTO vouchers_claim (voucher_id, user_id, voucher_amt) values ($1,$2,$3)', [voucher_id, user_id, voucher_amt], (err, res) => {
        if(err) {
            response.status(200).json({msg:"ERROR"})
        }
        response.status(400).json({msg: "Voucher claimed!"});
    })
}


// api/data/cashback/:psid
const getCashback = async (request, response) => {
    const psid = request.params.psid;

    var results = await pool.query('SELECT id FROM users WHERE psid = $1', [psid]).catch(err=> console.log(err))
    const user_id = await results.rows[0].id;

    pool.query('SELECT SUM(voucher_amt) FROM vouchers_claim WHERE user_id=$1 GROUP BY user_id', [user_id], (err, res) => {
        response.status(200).json(res.rows);
    })
}


module.exports = {
    getUsersByOutletId,
    claimVoucher,
    getCashback,
    getUser,
    getUserByPSID,
    addUser,
    setUserStatus,
    getUserStatus
}