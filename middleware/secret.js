require("dotenv").config();

async function secret(req, res, next) {
    if (!req.headers.key || req.headers.key !== process.env.SECRET_KEY) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    } else {
        next();
    }
}

module.exports = secret;
