const User = require("../model/User");

const getAllUsers = async (req, res) => {
    const result = await User.find();

    res.json(result);
};

const deleteUser = async (req, res) => {
    if (!req.body?.id)
        return res.status(400).json({ message: "User id required!" });

    const id = req.body.id;

    const user = await User.findOne({ _id: id }).exec();

    if (!user)
        return res.status(403).json({ message: `User id ${id} not found!` });

    const result = await user.deleteOne({ _id: id });

    console.log(result);

    res.json(result);
};

const getUser = async (req, res) => {
    if (!req.params?.id)
        return res.status(400).json({ message: "User Id required!" });

    const id = req.params.id;

    const user = await User.findOne({ _id: id }).exec();

    if (!user)
        return res.status(403).json({ message: `User id ${id} not found!` });

    res.json(user);
};

module.exports = { getAllUsers, deleteUser, getUser };
