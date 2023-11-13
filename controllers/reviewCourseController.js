const Course = require("../model/Course");
const Review = require("../model/Review");

const verifyRoles = require(".././middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");

const addReview = async function (req, res) {
    const courseId = req.params.courseId;
    const userId = req.userId;
    const { star, description } = req.body;

    if (!star) return res.status(400).json({ message: "Star is required" });

    try {
        const result = await Review.create({
            userId: userId,
            courseId: courseId,
            description: description,
            star: star,
        });

        return res.status(201).json({ message: "Đã thêm đánh giá", data: result });
    } catch (e) {
        return res.status(500).json({ message: e });
    }
};

const getAllReviews = async function (req, res) {
    if (!req?.params?.courseId) {
        return res.status(400).json({ message: "Course ID parameter is required." });
    }

    const reviews = await Review.find({ courseId: req.params.courseId });
    if (!reviews) return res.status(204).json({ message: "No reviews found." });
    res.json({ message: "Review of course id: " + req.params.courseId, data: reviews });
};

const getReview = async function (req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const review = await Review.findOne({ _id: req.params.id });
    if (!review) return res.status(204).json({ message: "No review found." });
    res.json({ message: "Review id: " + req.params.id, data: review });
};

const updateReview = async function (req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    try {
        const review = await Review.findOne({ _id: req.params });
        if (review.userId !== req.userId && verifyRoles(ROLES_LIST.User))
            return res.status(401).json({ message: "Unauthorized" });
    } catch (err) {
        return res.status(500).json({ message: error.message });
    }

    try {
        const course = await Review.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    star: req.body.title,
                    description: req.body.description,
                },
            },
            { new: true },
        );

        if (!course) {
            return res.status(204).json({ message: `No review matches ID ${req.params.id}.` });
        }

        return res.json({ message: "Sửa thành công", data: course });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteReview = async function (req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    try {
        const review = await Review.findOne({ _id: req.params });
        if (review.userId !== req.userId && verifyRoles(ROLES_LIST.User))
            return res.status(401).json({ message: "Unauthorized" });
    } catch (err) {
        return res.status(500).json({ message: error.message });
    }

    try {
        const course = await Review.findOneAndRemove({ _id: req.params.id });

        if (!course) {
            return res.status(204).json({ message: `No review matches ID ${req.params.id}.` });
        }

        return res.json({ message: "Xóa thành công", data: course });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview,
};
