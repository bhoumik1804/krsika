import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { MODULE_SLUGS } from '../constants/module.slugs.enum.js'
import { PERMISSION_ACTIONS } from '../constants/permission.actions.enum.js'
import { ROLES } from '../constants/user.roles.enum.js'

const userSchema = new Schema(
    {
        millId: { type: Schema.Types.ObjectId, ref: 'Mill', default: null }, // Null for Super Admin
        fullName: { type: String },
        email: {
            type: String,
        },
        googleId: { type: String },
        avatar: { type: String },
        password: { type: String }, // Store Bcrypt hash, not plain text
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.GUEST_USER,
        },

        // Embedded Permissions (Only used if role === 'MILL_STAFF')
        permissions: [
            {
                moduleSlug: {
                    type: String,
                    required: true,
                    enum: Object.values(MODULE_SLUGS),
                }, // e.g., 'inventory', 'sales'
                actions: [
                    {
                        type: String,
                        enum: Object.values(PERMISSION_ACTIONS),
                    },
                ],
            },
        ],
        refreshToken: {
            type: String,
        },

        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
    },
    { timestamps: true }
)
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

export const User = mongoose.model('User', userSchema)
