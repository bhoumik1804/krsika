import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { MODULE_SLUGS } from '../constants/module.slugs.enum.js'
import { PERMISSION_ACTIONS } from '../constants/permission.actions.enum.js'
import { ROLES } from '../constants/user.roles.enum.js'

// ---------------------------------------------------------
// 1. Sub-Schemas (from Zod definitions)
// ---------------------------------------------------------

// Maps to Zod: attendanceRecordSchema
const attendanceSchema = new Schema(
    {
        date: { type: String, required: true }, // Format: YYYY-MM-DD
        status: {
            type: String,
            enum: ['P', 'A', 'H'], // Present, Absent, Half Day
            required: true,
        },
    },
    { _id: false } // Disable _id for sub-documents if not needed
)

// ---------------------------------------------------------
// 2. Main User Schema (Merged)
// ---------------------------------------------------------

const userSchema = new Schema(
    {
        // --- Existing User Fields ---
        millId: { type: Schema.Types.ObjectId, ref: 'Mill', default: null },
        fullName: { type: String }, // Main display name
        email: { type: String, required: true, unique: true }, // Added unique/required for safety
        googleId: { type: String },
        avatar: { type: String },
        password: { type: String },
        phoneNumber: { type: String },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.GUEST_USER,
        },

        // Embedded Permissions
        permissions: [
            {
                moduleSlug: {
                    type: String,
                    required: true,
                    enum: Object.values(MODULE_SLUGS),
                },
                actions: [
                    {
                        type: String,
                        enum: Object.values(PERMISSION_ACTIONS),
                    },
                ],
            },
        ],

        refreshToken: { type: String },
        isActive: { type: Boolean, default: true }, // Existing global active flag
        lastLogin: { type: Date },

        // Zod 'attendanceHistory'
        attendanceHistory: [attendanceSchema],
    },
    { timestamps: true } // Handles createdAt & updatedAt automatically
)

// ---------------------------------------------------------
// 3. Middleware & Methods (Preserved)
// ---------------------------------------------------------

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            fullName: this.fullName,
            role: this.role,
            millId: this.millId,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            fullName: this.fullName,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
        }
    )
}

userSchema.plugin(aggregatePaginate)

export const User = mongoose.model('User', userSchema)
