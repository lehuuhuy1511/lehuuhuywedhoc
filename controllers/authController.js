const User = require("../model/User");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const handleLogin = async function (req, res) {
    const { user, password } = req.body;

    if (!user || !password) {
        return res.status(400).json({ message: "Username or Password are required" });
    }

    const foundUser = await User.findOne({ username: user }).exec();

    if (!foundUser) return res.sendStatus(401); //Unauthorized
    // Evaluate Password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        const roles = Object.values(foundUser.roles);

        // Create JWTs
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    userId: foundUser._id,
                    username: foundUser.username,
                    roles: roles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" },
        );
        const refreshToken = jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" },
        );

        // Saving Refresh Token with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie("jwt", refreshToken, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({
            accessToken,
        });
    } else return res.sendStatus(401);
};

module.exports = { handleLogin };
