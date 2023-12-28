const db = require("../db/models/index.js");

async function nim(req, res, next) {
    if (!req.headers.nim) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    await db.User.findOne({
        where: {
            nim: req.headers.nim,
        },
    }).then((user) => {
        if (user) {
            next();
        } else {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
    });
}

module.exports = nim;
