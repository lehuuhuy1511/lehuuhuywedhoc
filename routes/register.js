const express = require('express');

const router = express.Router();
const registerController = require('../controllers/resgiterController')


router.post('/', registerController.handleNewUser)

module.exports = router;