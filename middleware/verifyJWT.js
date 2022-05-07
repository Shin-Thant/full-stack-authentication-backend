const jwt = require("jsonwebtoken");

const verifyJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(403);

    const accessToken = authHeader.split(" ")[1];

    await jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_KEY,
        (err, decoded) => {
            if (err) return res.sendStatus(403);

            req.user = decoded.userInfo.username;
            req.roles = decoded.userInfo.roles;

            next();
        }
    );
};

module.exports = verifyJWT;
