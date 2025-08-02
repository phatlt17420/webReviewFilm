import express from "express";
import MovieController from "./movies.controller.js";
import ReviewsController from './reviews.controller.js';

const router = express.Router();

router.use((req, res, next) => {
    console.log(`[Movies Router Log] Path: ${req.path}, Original URL: ${req.originalUrl}, Base URL: ${req.baseUrl}`);
    next();
});

router.route("/").get(MovieController.apiGetMovies);


// 1. Định tuyến để lấy tất cả thông tin của phim và các review có liên quan dựa trên Id của phim.

// 2. Định tuyến để lấy tất cả các loại rating của phim trên dữ liệu.
router.route("/ratings").get(MovieController.apiGetRatings);

router
    .route('/review')
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview);
router.route("/:id").get(MovieController.apiGetMovieById);
export default router;
