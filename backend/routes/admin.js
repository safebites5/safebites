const express = require("express");

const router = express.Router();

const db =
require("../config/db");

// ====================================
// GET ALL ORDERS
// ====================================

router.get("/orders",(req,res)=>{

    const sql = `

    SELECT *

    FROM orders

    ORDER BY id DESC

    `;

    db.query(sql,(err,result)=>{

        if(err){

            console.log(err);

            return res.status(500).json(err);

        }

        res.json(result);

    });

});

// ====================================
// UPDATE STATUS
// ====================================

router.put("/orders/:id",(req,res)=>{

    const { id } =
    req.params;

    const {
        order_status
    } = req.body;

    const sql = `

    UPDATE orders

    SET order_status=?

    WHERE id=?

    `;

    db.query(

        sql,

        [order_status,id],

        (err,result)=>{

            if(err){

                console.log(err);

                return res.status(500).json(err);

            }

            res.json({

                success:true,
                message:"Status updated"

            });

        }

    );

});

module.exports = router;