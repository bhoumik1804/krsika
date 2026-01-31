export const ROLES = Object.freeze({
    SUPER_ADMIN: 'super_admin',
    MILL_ADMIN: 'mill-admin',
    MILL_STAFF: 'mill-staff',
    GUEST_USER: 'guest_user',
})

// // services/userService.js
// import { User } from '../models/user.model.js';
// import { ROLES } from '../constants/roles.js';

// export async function canImpersonate(userId) {
//   const user = await User.findById(userId);
//   return user?.role === ROLES.SUPER_ADMIN;
// }

// // models/user.model.js
// import mongoose from 'mongoose';
// import { ROLES } from '../constants/roles.js';

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },

//   role: {
//     type: String,
//     enum: Object.values(ROLES), // Only allow predefined roles
//     required: true,
//     default: ROLES.STAFF
//   },

//   metaDetails: { type: mongoose.Schema.Types.Mixed }, // key-value store

//   createdAt: { type: Date, default: Date.now }
// });

// export const User = mongoose.model('User', userSchema);
