const User = require("../model/User");

const handleLogout = async function (req, res) {
    // On client, also delete the accessToken

    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.sendStatus(204); //No content
    }
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        res.clearCookie("jwt", {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        });
        return res.sendStatus(204); //No content
    }

    // Delete refreshToken in db
    foundUser.refreshToken = "";
    const result = await foundUser.save();

    res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    }); // secure: true - only serves https

    res.sendStatus(204);
};

module.exports = { handleLogout };
