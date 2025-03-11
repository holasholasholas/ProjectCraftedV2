// const mongoose = require("mongoose");

// const groupSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     default: "",
//   },
//   owner: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   members: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     role: {
//       type: String,
//       enum: ['member', 'moderator', 'admin'],
//       default: 'member'
//     },
//     joinedAt: {
//       type: Date,
//       default: Date.now
//     }
//   }],
//   created: {
//     type: Date,
//     default: Date.now
//   },
//   isPublic: {
//     type: Boolean,
//     default: true
//   }
// });

// module.exports = mongoose.model('Group', groupSchema);