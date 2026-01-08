const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  approveUser,
  blockUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);
router.route('/:id').get(getUser).put(updateUser).delete(deleteUser);
router.put('/:id/approve', approveUser);
router.put('/:id/block', blockUser);

module.exports = router;
