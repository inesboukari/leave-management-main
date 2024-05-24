const schedule = require('node-schedule');
const colors = require('colors')
const User = require('../backend/models/user')
const Leave = require('../backend/models/leave')
const LeaveEntitlement = require('../backend/models/leaveEntitlement')

const date = new Date()
const currentYear = date.getFullYear()



const updateUserEntitlement = () => {
    let annualLeaveEntitlement;

    LeaveEntitlement
    .findOne({entity:"chengdu"})
    .then((record)=> {
        annualLeaveEntitlement = record.leaveEntitlement[0].entitlement
    })
    .catch(err => console.log("err: ", err))

    User
        .find({isAdmin: "user"})
        .then(users => {
            const userList = users

            // loop through user list and make adjustments to their leave entitlement
            for(i=0; i<userList.length;i++){

                const pendingAnnualLeave = userList[i].leave[0].pending
                const usedAnnualLeave = userList[i].leave[0].used

                // carryForward will be applied to leave type: prevYearAnnual 
                const carryForward = annualLeaveEntitlement - pendingAnnualLeave - usedAnnualLeave
                console.log("carryForward: ", carryForward)

                const chengduLrsLeaveScheme = [
                    new Leave({name: "Annual Leave ", type:"annual", entitlement: 30, pending: 0, used: 0, rollover: true, year: date.getFullYear(), note: "NA / "}),
                    new Leave({name: `Annual Leave  (${currentYear-1})`, type:"prevYearAnnual", entitlement: carryForward, pending: 0, used: 0, rollover: true, year: date.getFullYear(), note: "NA / "}),
                    new Leave({name: "Compassionate Leave ", type:"compassionate", entitlement: 10, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Death of spouse, parents, children, parents-in-law: 3 days\n own/spouse's grandparents, own siblings: 1 day \n "}),
                    new Leave({name: "Medical leave ", type:"medical", entitlement: 20, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "NA / 无"}),
                    new Leave({name: "Hospitalisation leave ", type:"hospitalisation", entitlement: 60, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "As prescribed by doctor\n"}),
                    new Leave({name: "Marriage Leave ", type:"marriage", entitlement: 15, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "For newly married staff\n"}),
                    new Leave({name: "Maternity leave ", type:"maternity", entitlement: 90, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "15 days have to be taken before delivery\n 15"}),
                    new Leave({name: "Miscarriage Leave ", type:"miscarriage", entitlement: 3, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Within 3 months of pregnancy: 30 days\nBetween 3 to 7 months: 45 days\n after 7 months: 15 days\n3: 30\n3: 45\n 7: 15"}),
                    new Leave({name: "Paternity Leave ", type:"paternity", entitlement: 30, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Male staff has to take leave within first week of child's birth\n "}),
                    new Leave({name: "Unpaid Leave ", type:"unpaid", entitlement: 30, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "NA / "}),
                    
                ]

                console.log("carry forward: ", carryForward)

                // reset leave field
                User.findOneAndUpdate(
                    {email: userList[i].email},
                    {$set: {leave: chengduLrsLeaveScheme}}
                    )
                .then(resp => {
                    if(!resp) {
                        return res.status(400).send("Failed to reset staff's annual leave entitlement")
                    }
                    console.log("successfully reset users' leave")
                })
                .catch(err => {
                    console.log(err)
                })
            }
        })
        .catch(err =>{
            console.log("err: ", err)
        })
}

exports.runCronJob = () => {
    const rule = new schedule.RecurrenceRule();
    // rule.month = 0 // jan
    // rule.date = 1 // 1st
    // rule.hour = 0 // 00:00
    // rule.minute = 0
    // rule.second = 0;
    // rule.tz = "Asia/Singapore"

    rule.hour = 0
    // rule.minute = 5
    // rule.second = 0
    rule.tz = "Asia/Singapore"

    schedule.scheduleJob(rule, () => {
        console.log(`cronjob is executed at ${new Date()}!`.rainbow);
        // updateUserEntitlement()
    });
}