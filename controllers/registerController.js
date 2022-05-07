const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const registerController = async (req, res) => {
    const { name, pwd } = req.body;

    if (!name || !pwd) return res.sendStatus(400);

    const duplicate = await User.findOne({ username: name }).exec();

    if (duplicate) return res.sendStatus(409);

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        console.log("hashed pwd", hashedPwd);

        const result = await User.create({
            username: name,
            password: hashedPwd,
        });

        console.log(result);

        res.status(201).json({ message: `New user ${name} is created!` });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
};

module.exports = registerController;
