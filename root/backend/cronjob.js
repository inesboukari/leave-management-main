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
                    new Leave({name: "Annual Leave 年假", type:"annual", entitlement: 15, pending: 0, used: 0, rollover: true, year: date.getFullYear(), note: "NA / 无"}),
                    new Leave({name: `Annual Leave 年额带过 (${currentYear-1})`, type:"prevYearAnnual", entitlement: carryForward, pending: 0, used: 0, rollover: true, year: date.getFullYear(), note: "NA / 无"}),
                    new Leave({name: "Compassionate Leave 丧假", type:"compassionate", entitlement: 3, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Death of spouse, parents, children, parents-in-law: 3 days\n own/spouse's grandparents, own siblings: 1 day \n 配偶、父母、子女、岳父母死亡: 3天\n 自己/配偶的祖父母、自己的兄弟姐妹: 1天"}),
                    new Leave({name: "Medical leave 病假", type:"medical", entitlement: 30, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "NA / 无"}),
                    new Leave({name: "Hospitalisation leave 住院假", type:"hospitalisation", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "As prescribed by doctor\n按医生规定"}),
                    new Leave({name: "Marriage Leave 婚假", type:"marriage", entitlement: 3, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "For newly married staff\n新婚"}),
                    new Leave({name: "Maternity leave 产假", type:"maternity", entitlement: 158, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "15 days have to be taken before delivery\n分娩前必须服用15天"}),
                    new Leave({name: "Miscarriage Leave 流产假", type:"miscarriage", entitlement: 45, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Within 3 months of pregnancy: 30 days\nBetween 3 to 7 months: 45 days\n after 7 months: 15 days\n3个月内流产: 30天\n3至7个月内流产: 45天\n 7个月后流产: 15天"}),
                    new Leave({name: "Natal Leave 受精相关假", type:"natal", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "As prescribed by doctor\n按医生规定"}),
                    new Leave({name: "Paternity Leave 陪产假", type:"paternity", entitlement: 20, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Male staff has to take leave within first week of child's birth\n 员工(男)必须在孩子出生第一周内用"}),
                    new Leave({name: "Unpaid Leave 无薪假", type:"unpaid", entitlement: 365, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "NA / 无"}),
                    new Leave({name: "Childcare Leave 育儿假", type:"childcare", entitlement: 10, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Only for staff with kids 3 years old and below\n仅限带 3 岁及以下儿童的员工"}),
                    new Leave({name: "Women's Day 三、八妇女节", type:"womenDay", entitlement: 0.5, pending: 0, used: 0, rollover: false, year: date.getFullYear(), note: "Can be taken on or after International Women's Day\n可在国际妇女节当天或之后休假"}),
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