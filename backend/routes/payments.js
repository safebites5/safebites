const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.post("/notification", (req, res) => {

    console.log(req.body);

    const {

        order_id,
        transaction_status,
        payment_type

    } = req.body;

    // PAYMENT SUCCESS

    if(

        transaction_status === "settlement"

        ||

        transaction_status === "capture"

    ){

        // UPDATE ORDER

        const sql = `
        
        UPDATE orders
        
        SET

        payment_status = 'paid',

        order_status = 'diproses'

        WHERE order_code = ?

        `;

        db.query(
            sql,
            [order_id],
            (err,result) => {

                if(err){
                    console.log(err);
                }

            }
        );

    }

    res.sendStatus(200);

});

module.exports = router;