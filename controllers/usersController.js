const User = require("../model/User");

const registerController = require("./resgiterController");

const addUser = async function (req, res) {
    return registerController.handleNewUser(req, res);
};

const getAllUsers = async function (req, res) {
    const users = await User.find();
    if (!users) return res.status(204).json({ message: "No users found." });
    res.json({ message: "Users found.", data: users });
};

const getUser = async function (req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) return res.status(204).json({ message: `No user matches ID ${req.body.id}.` });
    return res
        .status(200)
        .json({ message: "Lấy thông tin user có mã: " + req.body.id, data: user });
};

const deleteUser = async function (req, res) {
    const id = req.params.id;
    try {
        const result = await User.findOneAndRemove({ _id: id });
        return res.json({ message: "Xóa thành công user", data: result });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    addUser,
    getAllUsers,
    getUser,
    deleteUser,
};
