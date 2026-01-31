/**
 * User Roles - Used in: src/models/user.model.js (User.role)
 * Defines the hierarchy and access levels in the rice mill SaaS platform
 * Default: GUEST_USER
 */
export const ROLES = Object.freeze({
    /** The owner of the SaaS. Has global access to create Plans and verify Mills. */
    SUPER_ADMIN: 'super_admin',

    /** The owner of a specific Rice Mill. Can manage their own subscription, staff, and mill operations. */
    MILL_ADMIN: 'mill-admin',

    /** Employees created by the Mill Admin. Their access is restricted by the permissions array. */
    MILL_STAFF: 'mill-staff',

    /** Guest user is the default role; can log in but has not purchased any subscription and cannot access any modules. */
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
