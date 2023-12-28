const express = require("express");
const router = express.Router();
const db = require("../db/models/index.js");
const nim = require("../middleware/nim.js");
const { body, validationResult } = require("express-validator");

router.use(nim);

router.get("/", async (req, res) => {
    const products = await db.Product.findAll({
        include: {
            model: db.User,
            as: "user",
            where: {
                nim: req.headers.nim,
            },
        },
    });
    res.status(200).json({
        message: "Success",
        data: products.map((product) => {
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                author: product.author,
            };
        }),
    });
});

router.get("/:id", async (req, res) => {
    const product = await db.Product.findOne({
        include: {
            model: db.User,
            as: "user",
            where: {
                nim: req.headers.nim,
            },
        },
        where: {
            id: req.params.id,
        },
    });
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
        message: "Success",
        data: {
            id: product.id,
            title: product.title,
            description: product.description,
            price: product.price,
            author: product.author,
        },
    });
});

router.post(
    "/",
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("description").notEmpty().withMessage("Description is required"),
        body("price").notEmpty().isInt().withMessage("Price is required"),
        body("author").notEmpty().withMessage("Author is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Error", errors: errors.array() });
        }

        try {
            const user = await db.User.findOne({
                where: {
                    nim: req.headers.nim,
                },
            });
            const product = await db.Product.create({
                user_id: user.id,
                title: req.body.title,
                description: req.body.description,
                price: req.body.price,
                author: req.body.author,
            });
            res.status(201).json({
                message: "Success",
                data: {
                    id: product.id,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    author: product.author,
                },
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

router.put("/:id", async (req, res) => {
    try {
        const product = await db.Product.findOne({
            include: {
                model: db.User,
                as: "user",
                where: {
                    nim: req.headers.nim,
                },
            },
            where: {
                id: req.params.id,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await product.update({
            title: req.body.title || product.title,
            description: req.body.description || product.description,
            price: req.body.price || product.price,
            author: req.body.author || product.author,
        });
        res.status(200).json({
            message: "Success",
            data: {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                author: product.author,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const product = await db.Product.findOne({
            include: {
                model: db.User,
                as: "user",
                where: {
                    nim: req.headers.nim,
                },
            },
            where: {
                id: req.params.id,
            },
        });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        await product.destroy();
        res.status(200).json({
            message: "Success",
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
