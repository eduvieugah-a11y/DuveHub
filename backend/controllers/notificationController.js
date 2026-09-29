// import Notification from "../models/Notification.js";

// // ==========================================
// // GET USER NOTIFICATIONS
// // ==========================================
// export const getNotifications = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const notifications = await Notification.find({
//       recipientId: userId,
//     })
//       .sort({ createdAt: -1 })
//       .limit(20);

//     res.status(200).json(notifications);

//   } catch (error) {
//     console.error("Get notifications error:", error);

//     res.status(500).json({
//       message: "Unable to fetch notifications.",
//       error: error.message,
//     });
//   }
// };


// // ==========================================
// // GET UNREAD NOTIFICATION COUNT
// // ==========================================
// export const getUnreadCount = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const count = await Notification.countDocuments({
//       recipientId: userId,
//       isRead: false,
//     });

//     res.status(200).json({
//       count,
//     });

//   } catch (error) {
//     console.error("Unread count error:", error);

//     res.status(500).json({
//       message: "Unable to get notification count.",
//       error: error.message,
//     });
//   }
// };


// // ==========================================
// // MARK ALL NOTIFICATIONS AS READ
// // ==========================================
// export const markNotificationsAsRead = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     await Notification.updateMany(
//       {
//         recipientId: userId,
//         isRead: false,
//       },
//       {
//         $set: {
//           isRead: true,
//         },
//       }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Notifications marked as read.",
//     });

//   } catch (error) {
//     console.error(
//       "Mark notifications read error:",
//       error
//     );

//     res.status(500).json({
//       message: "Unable to mark notifications as read.",
//       error: error.message,
//     });
//   }
// };