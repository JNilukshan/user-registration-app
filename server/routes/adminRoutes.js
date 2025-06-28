const express = require('express');
const router = express.Router();
const { getAllUsers, exportUsersExcel,deleteUser } = require('../controllers/adminController');

router.get('/users', getAllUsers);
router.get('/users/export', exportUsersExcel);
router.delete('/users/:id', deleteUser);

module.exports = router;
