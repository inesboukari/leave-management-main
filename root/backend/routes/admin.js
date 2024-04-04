const express = require('express')

const adminController = require('../controllers/admin')

const router = express.Router()

// route is /admin/create-user
router.post('/create-user', adminController.postCreateUser)

// route is /admin/delete-user
router.post('/delete-user', adminController.postDeleteUser)

// route is /admin/approve-leave
router.post('/approve-leave', adminController.approveLeave)

// route is /admin/reject-leave
router.post('/reject-leave', adminController.rejectLeave)

// route is /admin/create-new-leave
router.post('/create-new-leave', adminController.postCreateLeaveType)

// route is /admin/get-user-info-by-email
router.get('/get-user-info-by-email/:id', adminController.getUserInfoByEmail)

// route is /admin/update-user
router.post('/update-user', adminController.postUpdateUser)

// route is /admin/get-work-day
router.get('/get-work-day', adminController.getWorkDay)

// route is /admin/set-work-day
router.post('/set-work-day', adminController.setWorkDay)

// route is /admin/send-reminder
router.post('/send-reminder', adminController.postSendReminder)

// route is /admin/clean-slate
router.post('/clean-slate', adminController.resetDatabaseToCleanSlate)

// route is /admin/get-leave-entitlement
router.get('/get-leave-entitlement', adminController.getLeaveEntitlement)

// route is /admin/post-leave-entitlement
router.post('/post-leave-entitlement', adminController.postLeaveEntitlement)

// route is /admin/delete-leave-type
router.post('/delete-leave-type', adminController.postDeleteLeaveType)

module.exports = router