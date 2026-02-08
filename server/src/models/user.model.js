import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { MODULE_SLUGS } from '../constants/module.slugs.enum.js'
import { PERMISSION_ACTIONS } from '../constants/permission.actions.enum.js'
import { ROLES } from '../constants/user.roles.enum.js'

// ---------------------------------------------------------
// Sub-Schemas
// ---------------------------------------------------------

const attendanceSchema = new Schema(
    {
        date: { type: String, required: true }, // Format: YYYY-MM-DD
        status: {
            type: String,
            enum: ['P', 'A', 'H'], // Present, Absent, Half Day
            required: true,
        },
    },
    { _id: false } // No _id for embedded docs
)

const permissionSchema = new Schema(
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
    { _id: false } // No _id for embedded docs
)

// ---------------------------------------------------------
// Main User Schema
// ---------------------------------------------------------

const userSchema = new Schema(
    {
        // Identity
        fullName: { type: String, trim: true },
        email: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
            sparse: true, // Allow multiple nulls
        },
        phoneNumber: { type: String, trim: true },
        avatar: { type: String },

        // Authentication
        password: { type: String, select: false }, // Exclude by default
        googleId: { type: String, sparse: true },
        refreshToken: { type: String, select: false },

        // Authorization
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.GUEST_USER,
            index: true,
        },

        // Associations
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            default: null,
            index: true,
        },

        // Status
        isActive: { type: Boolean, default: true, index: true },

        // Permissions
        permissions: [permissionSchema],
        // Staff-specific (embedded for performance)
        attendanceHistory: [attendanceSchema],

        post: {
            type: String,
        },
        salary: {
            type: Number,
        },
        address: {
            type: String,
        },
    },
    { timestamps: true } // Handles createdAt & updatedAt automatically
)

// ---------------------------------------------------------
// Indexes
// ---------------------------------------------------------
userSchema.index({ email: 1, role: 1 })
userSchema.index({ millId: 1, role: 1 })
userSchema.index({ googleId: 1 }, { sparse: true })

// ---------------------------------------------------------
// Middleware
// ---------------------------------------------------------

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 10)
})

// ---------------------------------------------------------
// Instance Methods
// ---------------------------------------------------------

userSchema.methods.isPasswordCorrect = async function (password) {
    if (!this.password) return false
    return bcrypt.compare(password, this.password)
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
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    })
}

// ---------------------------------------------------------
// Plugins
// ---------------------------------------------------------
userSchema.plugin(aggregatePaginate)

export const User = mongoose.model('User', userSchema)
