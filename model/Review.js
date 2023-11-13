const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {
        type: String,
        require: true,
    },
    courseId: {
        type: String,
        require: true,
    },
    description: {
        type: String,
    },
    star: {
        type: Number,
        require: true,
    },
    refreshToken: String,
});

module.exports = mongoose.model("Review", userSchema);
