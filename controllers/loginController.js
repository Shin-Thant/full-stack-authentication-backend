const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../model/User");

const loginController = async (req, res) => {
    const cookies = req.cookies;

    const { name, pwd } = req.body;

    if (!name || !pwd) return res.sendStatus(400);

    const foundUser = await User.findOne({ username: name }).exec();
    console.log("found user", foundUser);

    if (!foundUser) return res.sendStatus(403);

    const isMatched = await bcrypt.compare(pwd, foundUser.password);

    if (!isMatched) return res.sendStatus(401);

    if (isMatched) {
        const roles = Object.values(foundUser.roles).filter(Boolean);

        const accessToken = await jwt.sign(
            {
                userInfo: {
                    username: foundUser.username,
                    roles,
                },
            },
            process.env.ACCESS_TOKEN_KEY,
            { expiresIn: "20s" }
        );

        const newRefreshToken = await jwt.sign(
            {
                username: foundUser.username,
            },
            process.env.REFRESH_TOKEN_KEY,
            { expiresIn: "1d" }
        );

        let newRefreshTokenArray = !cookies?.jwt
            ? foundUser.refreshToken
            : foundUser.refreshToken.filter((rt) => rt !== cookies?.jwt);

        if (cookies?.jwt) {
            console.log("cookie exists");
            const refreshToken = cookies?.jwt;

            const foundUserWithToken = await User.findOne({
                refreshToken,
            }).exec();

            if (!foundUserWithToken) {
                console.log("no user with this token");
                newRefreshTokenArray = [];
            }

            res.clearCookie("jwt", {
                httpOnly: true,
                sameSite: "None",
                secure: true,
            });
        }

        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);

        res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: "None",
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });

        console.log(
            "===================================================================="
        );

        res.json({ roles, accessToken });
    }
};

module.exports = loginController;
