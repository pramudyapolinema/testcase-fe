const express = require("express");
const router = express.Router();
const db = require("../db/models/index.js");
const secret = require("../middleware/secret.js");
const { body, validationResult } = require("express-validator");

router.use(secret);
router.get("/", async (req, res) => {
    const users = await db.User.findAll();
    res.status(200).json({
        message: "Success",
        data: users,
    });
});

router.get("/:id", async (req, res) => {
    const user = await db.User.findOne({
        where: {
            id: req.params.id,
        },
        include: "products",
    });
    if (!user) {
        return res.status(200).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "Success",
        data: user,
    });
});

router.post(
    "/",
    [
        body("nim").notEmpty().withMessage("NIM is required"),
        body("nim").custom(async (value) => {
            const user = await db.User.findOne({
                where: {
                    nim: value,
                },
            });
            if (user) {
                throw new Error("NIM already exists");
            }
            return true;
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Error", errors: errors.array() });
        }

        try {
            const user = await db.User.create({
                nim: req.body.nim,
            });
            res.status(201).json({
                message: "Success",
                data: user,
            });
        } catch (error) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);

router.put("/:id", async (req, res) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.nim = req.body.nim;
        await user.save();
        res.status(200).json({
            message: "Success",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const user = await db.User.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await user.destroy();
        res.status(200).json({
            message: "Success",
            data: user,
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
