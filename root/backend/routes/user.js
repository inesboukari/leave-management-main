const express = require('express')

const router = express.Router()

const userController = require('../controllers/user')
const { addUser } = require('../controllers/auth')

router.get('/getUser/:id', userController.getUser)

router.get('/getAllUsers', userController.getAllUsers)

router.get('/getTeamCalendar', userController.getTeamLeaveRecords)

router.post('/addUser',addUser)

router.post('/numOfDays', userController.getNumOfDaysApplied)

router.post('/applyLeave', userController.postLeaveApplicationForm)

router.post('/cancelLeave', userController.cancelLeaveRequest)

module.exports = router