const Course = require("../model/Course");

const getAllCourses = async function (req, res) {
    const courses = await Course.find();
    if (!courses) return res.status(204).json({ message: "No courses found." });
    res.json(courses);
};

const createNewCourse = async function (req, res) {
    const { title, description, price, duration, category, instructors, lessons } = req.body;

    if (!title || !price || !duration) {
        return res.status(400).json({ message: "Title, price and duration are required" });
    }

    try {
        const result = await Course.create({
            title: title,
            description: description,
            price: price,
            duration: duration,
            category: category,
            instructors: instructors,
            lessons: lessons,
        });

        return res.status(201).json({ message: "Tạo thành công khóa học", data: result });
    } catch (e) {
        return res.status(500).json({ message: e });
    }
};

const updateCourse = async function (req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    if (req.body.title === "" || req.body.price === "" || req.body.duration === "") {
        return res.status(400).json({ message: "Title, price and duration are required" });
    }

    try {
        const course = await Course.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    price: req.body.price,
                    duration: req.body.duration,
                    category: req.body.category,
                    instructors: req.body.instructors,
                    lessons: req.body.lessons,
                },
            },
            { new: true },
        );

        if (!course) {
            return res.status(204).json({ message: `No course matches ID ${req.params.id}.` });
        }

        return res.json({ message: "Sửa thành công", data: course });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteCourse = async function (req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    try {
        const course = await Course.findOneAndDelete({ _id: req.params.id });

        if (!course) {
            return res.status(204).json({ message: `No course matches ID ${req.params.id}.` });
        }

        return res.json({ message: "Xóa thành công", data: course });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getCourse = async function (req, res) {
    if (!req?.params?.id) {
        return res.status(400).json({ message: "ID parameter is required." });
    }
    const course = await Course.findOne({ _id: req.params.id }).exec();
    if (!course) return res.status(204).json({ message: `No course matches ID ${req.body.id}.` });
    return res
        .status(200)
        .json({ message: "Lấy thông tin khóa học có mã: " + req.body.id, data: course });
};

const getAllLessonsInCourse = async function (req, res) {
    if (!req.params.courseId) {
        return res.status(400).json({ message: "Course ID parameter is required." });
    }

    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res
                .status(204)
                .json({ message: `No course matches ID ${req.params.courseId}.` });
        }

        const lessons = course.lessons;
        return res.json({ message: "Danh sách bài học trong khóa học", data: lessons });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getLessonInCourse = async function (req, res) {
    if (!req.params.courseId || !req.params.lessonId) {
        return res
            .status(400)
            .json({ message: "Course ID and Lesson ID parameters are required." });
    }

    try {
        const course = await Course.findById(req.params.courseId);

        if (!course) {
            return res
                .status(204)
                .json({ message: `No course matches ID ${req.params.courseId}.` });
        }

        const lesson = course.lessons.find((lesson) => lesson._id == req.params.lessonId);

        if (!lesson) {
            return res
                .status(204)
                .json({ message: `No lesson matches ID ${req.params.lessonId} in the course.` });
        }

        return res.json({ message: "Thông tin bài học", data: lesson });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const addLessonToCourse = async function (req, res) {
    if (!req.params.courseId) {
        return res.status(400).json({ message: "ID parameter is required." });
    }

    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required for a lesson." });
    }

    try {
        const course = await Course.findByIdAndUpdate(
            req.params.courseId,
            {
                $push: { lessons: { title, content } },
            },
            { new: true },
        );

        if (!course) {
            return res.status(204).json({ message: `No course matches ID ${req.params.id}.` });
        }

        return res.json({ message: "Thêm bài học thành công", data: course });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const updateLessonInCourse = async function (req, res) {
    if (!req.params.courseId || !req.params.lessonId) {
        return res
            .status(400)
            .json({ message: "Course ID and Lesson ID parameters are required." });
    }

    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required for a lesson." });
    }

    try {
        const course = await Course.findOneAndUpdate(
            { _id: req.params.courseId, "lessons._id": req.params.lessonId },
            {
                $set: {
                    "lessons.$.title": title,
                    "lessons.$.content": content,
                },
            },
            { new: true },
        );

        if (!course) {
            return res.status(204).json({ message: `No course or lesson matches the given IDs.` });
        }

        return res.json({ message: "Sửa bài học thành công", data: course });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteLessonFromCourse = async function (req, res) {
    if (!req.params.courseId || !req.params.lessonId) {
        return res
            .status(400)
            .json({ message: "Course ID and Lesson ID parameters are required." });
    }

    try {
        const course = await Course.findByIdAndUpdate(
            req.params.courseId,
            {
                $pull: { lessons: { _id: req.params.lessonId } },
            },
            { new: true },
        );

        if (!course) {
            return res.status(204).json({ message: `No course or lesson matches the given IDs.` });
        }

        return res.json({ message: "Xóa bài học thành công", data: course });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createNewCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    getCourse,
    getAllLessonsInCourse,
    getLessonInCourse,
    addLessonToCourse,
    updateLessonInCourse,
    deleteLessonFromCourse,
};
