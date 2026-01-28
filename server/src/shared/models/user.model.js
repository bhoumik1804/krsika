/**
 * User Model
 * ==========
 * Stores user authentication and profile data
 */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { USER_ROLES, USER_ROLES_ARRAY } from '../constants/roles.js'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [100, 'Name cannot exceed 100 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [8, 'Password must be at least 8 characters'],
            select: false, // Don't include password in queries by default
        },
        phone: {
            type: String,
            trim: true,
            match: [/^[0-9]{10}$/, 'Phone must be 10 digits'],
        },
        role: {
            type: String,
            enum: {
                values: USER_ROLES_ARRAY,
                message: 'Invalid role: {VALUE}',
            },
            default: USER_ROLES.MILL_STAFF,
        },
        mill: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            default: null, // Super admin won't have a mill
        },
        permissions: [
            {
                type: String,
                trim: true,
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        lastLogin: {
            type: Date,
            default: null,
        },
        passwordChangedAt: {
            type: Date,
            default: null,
        },
        passwordResetToken: {
            type: String,
            default: null,
        },
        passwordResetExpires: {
            type: Date,
            default: null,
        },
        avatar: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.password
                delete ret.__v
                return ret
            },
        },
        toObject: {
            transform(doc, ret) {
                delete ret.password
                delete ret.__v
                return ret
            },
        },
    }
)

// Indexes
userSchema.index({ role: 1 })
userSchema.index({ mill: 1, role: 1 })
userSchema.index({ isActive: 1 })

// Pre-save middleware to hash password
userSchema.pre('save', async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return

    // Hash password with salt rounds of 12
    const saltRounds = 12
    this.password = await bcrypt.hash(this.password, saltRounds)

    // Update passwordChangedAt for existing documents
    if (!this.isNew) {
        this.passwordChangedAt = new Date()
    }
})

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password)
}

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (tokenIssuedAt) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        )
        return tokenIssuedAt < changedTimestamp
    }
    return false
}

// Static method to find by email with password
userSchema.statics.findByEmailWithPassword = function (email) {
    return this.findOne({ email }).select('+password')
}

// Static method to find active users
userSchema.statics.findActive = function () {
    return this.find({ isActive: true })
}

// Add aggregate pagination plugin
userSchema.plugin(aggregatePaginate)

const User = mongoose.model('User', userSchema)

export default User
