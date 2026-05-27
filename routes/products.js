const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");

const db = require("../config/db");

// ====================================
// STORAGE IMAGE
// ====================================

const storage = multer.diskStorage({

    destination:(req,file,cb)=>{

        cb(null,"uploads/");

    },

    filename:(req,file,cb)=>{

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});

const upload = multer({
    storage:storage
});

// ====================================
// GET ALL PRODUCTS
// ====================================

router.get("/", (req, res) => {

    const sql = `
    
    SELECT *
    
    FROM breads
    
    ORDER BY id DESC
    
    `;

    db.query(sql, (err, result) => {

        if(err){

            console.log(err);

            return res.json(err);

        }

        res.json(result);

    });

});

// ====================================
// GET SINGLE PRODUCT
// ====================================

router.get("/:id",(req,res)=>{

    const id =
    req.params.id;

    const sql = `
    
    SELECT *
    
    FROM breads
    
    WHERE id=?
    
    `;

    db.query(

        sql,

        [id],

        (err,result)=>{

            if(err){

                console.log(err);

                return res.json(err);

            }

            res.json(result[0]);

        }

    );

});

// ====================================
// ADD PRODUCT
// ====================================

router.post(

    "/",

    upload.single("image"),

    (req,res)=>{

        const {

            name,
            description,
            price,
            preorder_limit,
            preorder_day,
            preorder_note,
            pickup_date,
            category

        } = req.body;

        const image =
        req.file
        ? req.file.filename
        : null;

        const sql = `
        
        INSERT INTO breads(

            name,
            description,
            price,
            preorder_limit,
            preorder_day,
            preorder_note,
            pickup_date,
            category,
            image

        )

        VALUES(?,?,?,?,?,?,?,?,?)

        `;

        db.query(

            sql,

            [

                name,
                description,
                price,
                preorder_limit,
                preorder_day,
                preorder_note,
                pickup_date,
                category,
                image

            ],

            (err,result)=>{

                if(err){

                    console.log(err);

                    return res.json(err);

                }

                res.json({

                    success:true,
                    message:"Produk berhasil ditambahkan"

                });

            }

        );

    }

);

// ====================================
// UPDATE PRODUCT
// ====================================

router.put(

    "/:id",

    upload.single("image"),

    (req,res)=>{

        const id =
        req.params.id;

        const {

            name,
            description,
            price,
            preorder_limit,
            preorder_day,
            preorder_note,
            pickup_date,
            category

        } = req.body;

        let sql = `
        
        UPDATE breads
        
        SET
        
        name=?,
        description=?,
        price=?,
        preorder_limit=?,
        preorder_day=?,
        preorder_note=?,
        pickup_date=?,
        category=?
        
        `;

        let values = [

            name,
            description,
            price,
            preorder_limit,
            preorder_day,
            preorder_note,
            pickup_date,
            category

        ];

        // ====================================
        // UPDATE IMAGE
        // ====================================

        if(req.file){

            sql += `,
            
            image=?
            
            `;

            values.push(
                req.file.filename
            );

        }

        sql += `
        
        WHERE id=?
        
        `;

        values.push(id);

        db.query(

            sql,

            values,

            (err,result)=>{

                if(err){

                    console.log(err);

                    return res.json(err);

                }

                res.json({

                    success:true,
                    message:"Produk berhasil diupdate"

                });

            }

        );

    }

);

// ====================================
// DELETE PRODUCT
// ====================================

router.delete("/:id",(req,res)=>{

    const id =
    req.params.id;

    const sql = `
    
    DELETE FROM breads
    
    WHERE id=?
    
    `;

    db.query(

        sql,

        [id],

        (err,result)=>{

            if(err){

                console.log(err);

                return res.json(err);

            }

            res.json({

                success:true,
                message:"Produk berhasil dihapus"

            });

        }

    );

});

module.exports = router;