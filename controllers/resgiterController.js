const User = require("../model/User");

const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ message: "Username or Password are required" });
    }

    // check for duplicate usernames in the db

    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.status(409).json({ message: "Tài khoản đã được sử dụng" });
    try {
        //encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and Store the New User
        const result = await User.create({
            username: user,
            password: hashedPassword,
        });

        res.status(201).json({
            message: `New user ${user} created`,
            data: result,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = { handleNewUser };
