const express = require("express");
const router = express.Router();

const snap =
require("../config/midtrans");

// CREATE PAYMENT TOKEN

router.post("/", async(req,res) => {

    try{

        const {

            total,
            customer_name,
            phone

        } = req.body;

        const orderCode =
        "ORDER-" + Date.now();

        const parameter = {

            transaction_details:{

                order_id:orderCode,

                gross_amount:total

            },

            customer_details:{

                first_name:
                customer_name,

                phone:phone

            }

        };

        const transaction =
        await snap.createTransaction(
            parameter
        );

        res.json({

            success:true,

            snap_token:
            transaction.token,

            order_code:
            orderCode

        });

    }catch(error){

        console.log(error);

        res.json({
            success:false
        });

    }

});

module.exports = router;