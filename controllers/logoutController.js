const User = require("../model/User");

const logoutController = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(403);

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });

        return res.sendStatus(403);
    }

    const newRefreshTokenArr = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken
    );

    foundUser.refreshToken = [...newRefreshTokenArr];
    const result = await foundUser.save();

    console.log(result);

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });

    console.log(
        "============================================================="
    );

    res.sendStatus(204);
};

module.exports = logoutController;
