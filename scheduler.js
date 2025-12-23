const scheduler = require('node-schedule');
const { Op } = require('sequelize');


// scheduler.scheduleJob('* * * * *', async () => {

//     const thresholdDate = new Date(new Date() -  3 * 60 * 1000);

//     await Notification.destroy({
//         where: {
//             type: 'agency_invite_host',
//             created: { [Op.lte]: thresholdDate },
//         }
//     })

//     await Host_Invitation.destroy({
//         where: {
//             status: 'Pending',
//             created: { [Op.lte]: thresholdDate },
//         }
//     })



//     console.log("Delete Invites/Notifications Scheduler Called")
// });






