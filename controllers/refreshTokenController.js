const User = require("../model/User");
const jwt = require("jsonwebtoken");

const refreshTokenController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        console.log("cookie error");
        return res.sendStatus(403);
    }

    const refreshToken = cookies?.jwt;

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_KEY,
            async (err, decoded) => {
                if (err) return res.sendStatus(403);

                const hackedUser = await User.findOne({
                    username: decoded.username,
                }).exec();
                if (hackedUser) hackedUser.refreshToken = [];

                const result = await hackedUser.save();
            }
        );

        return res.sendStatus(403);
    }

    const refreshTokenArray = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken
    );

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_KEY,
        async (err, decoded) => {
            if (err) {
                foundUser.refreshToken = [...refreshTokenArray];
                await foundUser.save();

                console.log("error");
                return res.sendStatus(403);
            }

            if (err || decoded.username !== foundUser.username) {
                console.log("username error");
                return res.sendStatus(403);
            }

            const roles = Object.values(foundUser.roles).filter(Boolean);

            console.log(roles);

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

            foundUser.refreshToken = [...refreshTokenArray, newRefreshToken];
            const result = await foundUser.save();
            console.log(result);

            res.cookie("jwt", newRefreshToken, {
                httpOnly: true,
                sameSite: "None",
                // secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            res.json({ roles, accessToken });
        }
    );
};

module.exports = refreshTokenController;
