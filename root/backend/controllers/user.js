const User = require('../models/user')
const Workday = require('../models/workday')

var moment = require('moment');
require('moment-weekday-calc');

const sendgridMail = require('@sendgrid/mail');
const leaveHistory = require('../models/leaveHistory');
const TeamCalendar = require('../models/teamCalendar')

const io = require('../socket')

//code par moi
exports.login = async (req, res) => {
    let mail = req.body.mail;
    let pass = req.body.password
    let user = await findUserByEmail(mail)
    if (user != null && user.password == pass) {
        let token = jwt.sign({ userId: 10 })
        res.status(200).json({ token })
    }
    else {
        res.send(401).json("verify your input")
    }
}
async function findUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        return null;
    }
}

const date = new Date()

exports.getUser = (req, res, next) => {
    const userId = req.params.id
    // console.log("req.params: ", req.params)
    User
        .findOne({ _id: userId })
        .then(user => {
            if (!user) {
                return res.status(400).send("user not found")
            }
            return res.status(200).send(
                {
                    _id: user._id,
                    name: user.name,
                    isAdmin: user.isAdmin,
                    email: user.email,
                    createdOn: user.createdOn,
                    lastUpdatedOn: user.lastUpdatedOn,
                    reportingEmail: user.reportingEmail,
                    coveringEmail: user.coveringEmail,
                    leave: user.leave,
                    leaveHistory: user.leaveHistory,
                    staffLeave: user.staffLeave
                })
        })
        .catch(err => console.log("getUser err:", err))
}

exports.getAllUsers = (req, res, next) => {
    User.find((err, docs) => {
        if (!err) {
            // console.log(docs)
            return res.status(200).send(docs)
        } else {
            console.log('Failed to get all users: ' + err);
            return res.status(400).send('Failed to get all users: ' + err)
        }
    });
}

exports.getTeamLeaveRecords = (req, res, next) => {

    TeamCalendar
        .findOne({ entity: "chengdu" },)
        .then(result => {
            if (!result) {
                return res.status(401).send("get team leave: entity's team leave not found")
            }
            // update names to big calendar format
            // console.log("team record: ", result)
            const newTeamLeave = result.approvedLeave.map(({
                _id: id,
                ...rest
            }) => ({
                id,
                ...rest
            }));

            // console.log(newTeamLeave)

            return res.send(newTeamLeave)
        })
        .catch(err => {
            console.log("team cal error: ", err)
            return res.status(400).send(`team cal error: ${err}`)
        })
}

exports.getNumOfDaysApplied = (req, res, next) => {
    const startDate = req.body.startDate
    const endDate = req.body.endDate


    Workday
        .findOne({ entity: "chengdu" })
        .then(result => {
            if (!result) {
                return res.status(401).send("get num of leave days applied: failed to find entity's team cal record")
            }
            // console.log(result)
            const holidaySelection = result.holiday.map(timestamp => moment(timestamp).format("DD MMM YYYY"))
            const workdaySelection = result.workday.map(timestamp => moment(timestamp).format("DD MMM YYYY"))

            if (startDate < endDate) {
                const numOfDays = moment().weekdayCalc({
                    rangeStart: moment(startDate).format("DD MMM YYYY"),
                    rangeEnd: moment(endDate).format("DD MMM YYYY"),
                    weekdays: [1, 2, 3, 4, 5],
                    exclusions: holidaySelection, // do not count these dates as business days
                    inclusions: workdaySelection // count as business days
                })
                console.log(moment(startDate).format("DD MMM YYYY"), moment(endDate).format("DD MMM YYYY"), numOfDays)
                return res.status(200).send({ numOfDaysApplied: numOfDays })
            }
            else {
                return res.status(400).send("start date is bigger than end date")
            }
        })
        .catch(err => {
            console.log("get team leave: ", err)
            return res.status(400).json(`get team leave: ${err}`)
        })
}

exports.postLeaveApplicationForm = (req, res, next) => {
    const userId = req.body.userId
    const userEmail = req.body.userEmail
    const coveringEmail = req.body.coveringEmail
    const reportingEmail = req.body.reportingEmail
    const staffName = req.body.staffName
    const file = req.body.file
    const remarks = req.body.remarks
    const leaveType = req.body.leaveType
    const numOfDaysTaken = req.body.numOfDaysTaken
    const leaveClassification = req.body.leaveClassification
    const dateOfApplication = moment(req.body.dateOfApplication).format("DD MMM YYYY")
    const startDate = moment(req.body.startDate).format("DD MMM YYYY")
    const endDate = moment(req.body.endDate).format("DD MMM YYYY")
    console.log("req.body: ", req.body)

    // staff's leave history
    const leaveHistoryData = new leaveHistory({
        leaveType: leaveType,
        timePeriod: `${startDate} - ${endDate}`,
        startDateUnix: req.body.startDate,
        endDateUnix: req.body.endDate,
        staffName: req.body.staffName,
        submittedOn: dateOfApplication,
        quotaUsed: numOfDaysTaken,
        coveringEmail: coveringEmail,
        reportingEmail: reportingEmail,
        leaveClassification: leaveClassification,
        remarks: remarks,
        status: "pending",
        year: date.getFullYear()
    })

    // create subordinate leave for reporting officer
    const staffLeaveData = {
        staffEmail: userEmail,
        coveringEmail: coveringEmail,
        reportingEmail: reportingEmail,
        leaveType: leaveType,
        timePeriod: `${startDate} - ${endDate}`,
        startDateUnix: req.body.startDate,
        endDateUnix: req.body.endDate,
        staffName: req.body.staffName,
        submittedOn: dateOfApplication,
        quotaUsed: numOfDaysTaken,
        leaveClassification: leaveClassification,
        remarks: remarks,
        status: "pending",
        year: date.getFullYear()
    }

    // find userid from mongodb
    User
        .findOne({ _id: userId })
        .then(user => {
            if (!user) return res.status(400).send("user ID did not match db")

            console.log("leaveHistoryData: ", leaveHistoryData)
            const filterTargetLeaveType = user.leave.filter(leave => leaveType === leave.name)

            const targetLeaveName = filterTargetLeaveType[0].name

            return User.updateOne(
                { _id: userId, "leave.name": targetLeaveName },
                {
                    $inc: { "leave.$.pending": numOfDaysTaken },
                })
        })
        .then((result) => {
            if (!result) {
                return res.status(401).send("apply leave: failed to update user's pending count")
            }
            return User.updateOne(
                { _id: userId },
                { $push: { "leaveHistory": leaveHistoryData } }) // create leave history
        })
        .then((result) => {
            if (!result) {
                return res.status(401).send("apply leave: failed to update user's leave history data")
            }
            return User.findOne({ email: reportingEmail })
        })
        .then((reportingOfficer) => {
            if (!reportingOfficer) {
                return res.status(401).send("apply leave: reporting officer email not found in db")
            }
            return User.updateOne(
                { email: reportingEmail },
                { $push: { "staffLeave": staffLeaveData } }
            )
        })
        .then((result) => {
            if (!result) {
                return res.status(401).send("apply leave: failed to update reporting officer's staff leave")
            }
            return res.status(200).send("leave application successful")
            // send email to user, covering
            // sendgridMail.setApiKey(process.env.SENDGRID_API_KEY)

            // const emailToUserAndCovering = {
            // to: userEmail,
            // from: 'mfachengdu@gmail.com', // Change to your verified sender
            // cc: coveringEmail,
            // subject: `Leave Application from ${startDate} to ${endDate}`,
            // html: `
            //     <div>
            //         <p>Hi ${userEmail}, you applied ${numOfDaysTaken} days of <strong>${leaveType}</strong> from ${startDate} to ${endDate}</p> 
            //         <p>You will receive an email confirmation once your reporting officer reviews the request, thank you.</p>
            //     </div>
            //     <div>
            //         <p>您好 ${userEmail}，您在${startDate}至${endDate}申请了${numOfDaysTaken}天<strong>${leaveType}</strong></p> 
            //         <p>一旦您的主管审核，您将收到一封邮件，谢谢。</p>
            //     </div>
            // `
            // }

            // sendgridMail
            //     .send(emailToUserAndCovering) // email to inform user and covering of leave request
            //     .then(() => {
            //         console.log('email sent to user and covering')
            //     })
            //     .catch((error) => {
            //         console.error("sendgrid error when sending to user/covering: ", error)
            //         console.log("err: ", error.response.body)
            //         return res.status(488).send("sendgrid error: ", error)
            //     })

            //     const emailToReporting = {
            //         to: reportingEmail,
            //         from: 'mfachengdu@gmail.com', // Change to your verified sender
            //         subject: `Leave Application by ${userEmail} - ${startDate} to ${endDate} `,
            //         html: `
            //             <div>
            //                 <p>Hi ${reportingEmail}, </p> 
            //                 <p>${userEmail} would like to apply for ${numOfDaysTaken} days of <strong>${leaveType}</strong> from ${startDate} to ${endDate}</p>
            //                 <p>Log in to ${process.env.FRONTENDURL} to approve or reject this request. Thank you. </p>
            //             </div>
            //         `
            //         }

            //     sendgridMail
            //         .send(emailToReporting) // email to inform reporting of user's leave request
            //         .then(() => {
            //             console.log('email sent to reporting')
            //             console.log("leave application successful")
            //             return res.status(200).send("leave application successful, email sent to user, covering and reporting officer") 
            //         })
            //         .catch((error) => {
            //             console.error("sendgrid error when sending to reporting: ", error)
            //             return res.status(488).send("sendgrid error: ", error)
            //         })
        })
        .catch(err => {
            console.log("postLeaveApplicationForm err: ", err)
            return res.status(400).send(`postLeaveApplicationForm err: ${err}`)
        })
}

exports.cancelLeaveRequest = (req, res) => {
    const userId = req.body.userId
    const reportingEmail = req.body.reportingEmail
    const userEmail = req.body.userEmail
    const leaveHistory = req.body.targetLeaveHistory
    const staffName = leaveHistory[0].staffName
    const leaveType = leaveHistory[0].leaveType
    const quotaUsed = leaveHistory[0].quotaUsed
    const timePeriod = leaveHistory[0].timePeriod
    const submittedOn = leaveHistory[0].submittedOn
    const leaveStatus = leaveHistory[0].status
    const startDate = new Date(+(leaveHistory[0].startDateUnix))
    const endDate = new Date(+(leaveHistory[0].endDateUnix))
    const startDateUnix = leaveHistory[0].startDateUnix
    const endDateUnix = leaveHistory[0].endDateUnix

    console.log("cancelLeaveRequest req.body: ", req.body)

    const currentDateUnix = new Date().getTime()

    if (leaveStatus === "approved" && currentDateUnix >= startDate) {
        // scenario: current year's leave was approved and consumed but staff cancelled it (i.e. applied date has passed)
        // requires RO's approval to cancel past leave

        // update reporting's leave status to pending cancellation
        User.findOneAndUpdate(
            {
                email: reportingEmail,
                "staffLeave.leaveType": leaveType,
                "staffLeave.staffName": staffName,
                "staffLeave.timePeriod": timePeriod,
                "staffLeave.startDateUnix": +startDateUnix,
                "staffLeave.submittedOn": submittedOn,
                "staffLeave.quotaUsed": quotaUsed,
                "staffLeave.status": leaveStatus,
            },
            {
                $set: { "staffLeave.$.status": "pending cancellation" }
            })
            .then((result) => {
                if (!result) {
                    return res.status(401).send("cancel leave: failed to update RO's staffLeave to pending cancellation")
                }
                // console.log("RO's record: ", result.staffLeave.length)
                // update staff's leave status to pending cancellation

                return User.findOneAndUpdate(
                    {
                        email: userEmail,
                        "leaveHistory.leaveType": leaveType,
                        "leaveHistory.timePeriod": timePeriod,
                        "leaveHistory.quotaUsed": quotaUsed,
                        "leaveHistory.status": leaveStatus,
                        "leaveHistory.submittedOn": submittedOn,
                    },
                    {
                        $set: { "leaveHistory.$.status": "pending cancellation" }
                    }
                )
            })
            .then((result) => {
                if (!result) {
                    return res.status(401).send("cancel leave: failed to update user's leave to pending cancellation")
                }
                return res.send("updated leave status to pending cancellation")
                // console.log("user's leave record: ", result)
                // send cancellation approval email to reporting 
                // const cancellationEmailToReporting = {
                //     to: reportingEmail,
                //     from: 'mfachengdu@gmail.com',
                //     subject: `Cancellation of approved leave by ${userEmail}`,
                //     html: `
                //         <div>
                //             <p>Hi ${reportingEmail}, </p> 
                //             <p>${userEmail} would like to cancel an approved leave request from ${startDate} to ${endDate}</p>
                //             <p>Log in to ${process.env.REACT_APP_FRONTENDURL} to approve or reject this cancellation request. Thank you. </p>
                //         </div>
                //     `
                // }
                // sendgridMail
                //     .send(cancellationEmailToReporting) // email to inform reporting of user's leave request
                //     .then(() => {
                //         console.log('cancellation email for approved leave sent to RO')
                //         return res.send("updated leave status to pending cancellation")
                //     })
                //     .catch((error) => {
                //         console.error("sendgrid error when sending cancellation email for approved leave to RO: ", error)
                //         return res.status(488).send("sendgrid error: ", error)
                //     })
            })
            .catch(err => {
                console.log("failed to cancel leave (pending cancellation) err:", err)
                return res.status(400).json(`failed to cancel leave (pending cancellation) err: ${err}`)
            })
    }

    else if (leaveStatus === "approved" && currentDateUnix < startDate) {
        // scenario: leave was approved but not consumed yet (i.e. date has not passed)
        // do not require RO to approve cancellation

        User
            .findOneAndUpdate({ _id: userId, "leave.name": leaveType },
                { // subtract used count after cancellation
                    $inc: { "leave.$.used": -quotaUsed }
                }
            )
            .then(result => {
                if (!result) {
                    return res.status(401).send("cancel leave: failed to update staff's used count")
                }
                // remove cancelled leave from team calendar
                console.log("deleting from team calendar")
                return TeamCalendar.updateOne(
                    { team: "chengdu" },
                    {
                        $pull: {
                            approvedLeave: {
                                startDateUnix: startDateUnix.toString(),
                                endDateUnix: endDateUnix.toString(),
                                staffName: staffName,
                            }
                        }
                    }
                )
            })
            .then((teamCalResult) => {
                if (!teamCalResult) {
                    return res.status(401).send("cancel leave: err deleting team calendar record")
                }
                const teamCalendarRecord =
                {
                    startDateUnix: startDateUnix.toString(),
                    endDateUnix: endDateUnix.toString(),
                    staffName: staffName
                }

                // update client to delete in real time
                io.getIO().emit('calendar', { action: 'delete', calendarRecord: teamCalendarRecord })

                console.log("teamCalResult: ", teamCalResult)
                // update user's leave history status
                return User.findOneAndUpdate(
                    {
                        _id: userId,
                        "leaveHistory.startDateUnix": startDateUnix,
                        "leaveHistory.leaveType": leaveType,
                        "leaveHistory.timePeriod": timePeriod,
                        "leaveHistory.quotaUsed": quotaUsed,
                        "leaveHistory.status": leaveStatus,
                        "leaveHistory.submittedOn": submittedOn,
                    },
                    {
                        $set: { "leaveHistory.$.status": "cancelled" }
                    }
                )
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).send("cancel leave: failed to update staff to cancelled")
                }
                // update reporting's leave status
                return User.findOneAndUpdate(
                    {
                        email: reportingEmail,
                        "staffLeave.leaveType": leaveType,
                        "staffLeave.timePeriod": timePeriod,
                        "staffLeave.startDateUnix": +startDateUnix,
                        "staffLeave.submittedOn": submittedOn,
                        "staffLeave.quotaUsed": quotaUsed,
                        "staffLeave.status": leaveStatus,
                    },
                    {
                        $set: { "staffLeave.$.status": "cancelled" }
                    })
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).send("cancel leave: failed to update RO's staffLeave to cancelled")
                }
                console.log("updated leave status to cancelled for both staff and RO")
                return res.send("updated leave status to cancelled for both staff and RO")
            })
            .catch(err => {
                console.log("failed to cancel leave:", err)
                return res.status(400).json(`failed to cancel leave: ${err}`)
            })
    }
    else {
        // scenario: leave is still pending approval and not consumed yet (i.e. date has not passed)
        // do not require RO approval to cancel leave

        User
            .findOneAndUpdate({ _id: userId, "leave.name": leaveType },
                { // update pending count after cancellation
                    $inc: { "leave.$.pending": -quotaUsed },
                }
            )
            .then((user) => {
                if (!user) {
                    return res.status(401).send("cancel leave: failed to update staff's pending leave count")
                }
                return User.findOneAndUpdate(
                    {
                        _id: userId,
                        "leaveHistory.startDateUnix": startDateUnix,
                        "leaveHistory.leaveType": leaveType,
                        "leaveHistory.timePeriod": timePeriod,
                        "leaveHistory.quotaUsed": quotaUsed,
                        "leaveHistory.status": leaveStatus,
                        "leaveHistory.submittedOn": submittedOn,
                    },
                    {
                        $set: { "leaveHistory.$.status": "cancelled" }
                    }
                )
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).send("cancel leave: failed to update staff's leave status to cancelled")
                }
                // update reporting's leave status
                return User.findOneAndUpdate(
                    {
                        email: reportingEmail,
                        "staffLeave.leaveType": leaveType,
                        "staffLeave.timePeriod": timePeriod,
                        "staffLeave.startDateUnix": +startDateUnix,
                        "staffLeave.submittedOn": submittedOn,
                        "staffLeave.quotaUsed": quotaUsed,
                        "staffLeave.status": leaveStatus,
                    },
                    {
                        $set: { "staffLeave.$.status": "cancelled" }
                    })
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).send("cancel leave: failed to update RO's staffLeave status to cancelled")
                }
                console.log("updated leave status to cancelled for both staff and RO")
                return res.send("updated leave status to cancelled for both staff and RO")
            })
            .catch(err => {
                console.log("failed to cancel leave:", err)
                return res.status(400).json(`failed to cancel leave: ${err}`)
            })
    }
}