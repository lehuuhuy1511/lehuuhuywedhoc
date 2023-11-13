const express = require("express");
const router = express.Router();
const coursesController = require("../../controllers/coursesController");
const reviewcourseController = require("../../controllers/reviewCourseController");

const ROLES_LIST = require("../../config/roles_list");

const verifyRoles = require("../../middleware/verifyRoles");

const verifyJWT = require("../../middleware/verifyJWT");

// Lấy tất cả khóa học, thêm khóa học
router
    .route("/")
    .get(coursesController.getAllCourses)
    .post(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        coursesController.createNewCourse,
    );

// Lấy 1 khóa học, xóa, sửa
router
    .route("/:id")
    .get(coursesController.getCourse)
    .delete(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        coursesController.deleteCourse,
    )
    .put(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        coursesController.updateCourse,
    );

router
    .route("/:courseId/review")
    .post(verifyJWT, reviewcourseController.addReview)
    .get(reviewcourseController.getAllReviews);

router
    .route("/:courseId/review/:id")
    .get(reviewcourseController.getReview)
    .put(verifyJWT, reviewcourseController.updateReview)
    .delete(verifyJWT, reviewcourseController.deleteReview);

// Lấy 1 bài học trong khóa học, sửa, xóa
router
    .route("/:courseId/lessons/:lessonId")
    .get(verifyJWT, coursesController.getLessonInCourse)
    .put(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        coursesController.updateLessonInCourse,
    )
    .delete(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        coursesController.deleteLessonFromCourse,
    );

// Thêm bài học vào khóa học
router
    .route("/:courseId/lessons")
    .get(coursesController.getAllLessonsInCourse)
    .post(
        verifyJWT,
        verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
        coursesController.addLessonToCourse,
    );

module.exports = router;
