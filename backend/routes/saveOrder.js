const express = require("express");
const router = express.Router();

const db = require("../config/db");

router.post("/", (req,res) => {

    const {

        user_id,

        customer_name,
        phone,
        city,
        address,

        total,

        payment_method,

        payment_status,

        order_status,

        order_code,

        items

    } = req.body;

    const sql = `
    
    INSERT INTO orders(

        user_id,

        customer_name,
        phone,
        city,
        address,

        order_code,
        total,

        payment_method,
        payment_status,
        order_status

    )

    VALUES(?,?,?,?,?,?,?,?,?,?)

    `;

    db.query(
        sql,
        [

            user_id,

            customer_name,
            phone,
            city,
            address,

            order_code,
            total,

            payment_method,
            payment_status,
            order_status

        ],

        (err,result) => {

            if(err){

                console.log(err);

                return res.json({
                    success:false
                });

            }

            const orderId =
            result.insertId;

            // SAVE ITEMS

            items.forEach(item => {

                const itemSql = `
                
                INSERT INTO order_items(

                    order_id,
                    bread_id,
                    qty,
                    price,
                    subtotal

                )

                VALUES(?,?,?,?,?)

                `;

                db.query(
                    itemSql,
                    [

                        orderId,
                        item.id,
                        item.qty,
                        item.price,
                        item.qty * item.price

                    ]
                );

            });

            res.json({
                success:true
            });

        }

    );

});

module.exports = router;