const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// Merge params with the current route to allow for nested routes
// eg. If we have a route '/tours/:id/reviews', this will allow us to
// access the tour ID on the request params, even after we've defined
// the reviews routes separately.
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(
    // authController.protect,
    // authController.restrictTo('admin', 'lead-guide'),
    reviewController.deleteReview,
  );

module.exports = router;
