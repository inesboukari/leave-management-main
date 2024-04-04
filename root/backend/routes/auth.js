const express = require('express')

const authController = require('../controllers/auth')

const router = express.Router()

router.get('/', authController.getHome)
router.post('/adduser',authController.addUser)
router.post('/login',authController.postLogin)
router.post('/logout',authController.postLogout)
router.post('/change-password', authController.postChangePassword)
router.post('/set-new-password/', authController.postUpdatePassword)
router.post('/validate-session/', authController.postValidateSession)

module.exports = router