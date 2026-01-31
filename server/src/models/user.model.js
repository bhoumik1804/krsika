const UserSchema = new Schema(
    {
        millId: { type: Schema.Types.ObjectId, ref: 'Mill', default: null }, // Null for Super Admin
        fullName: { type: String },
        email: {
            type: String,
        },
        password: { type: String }, // Store Bcrypt hash, not plain text
        role: {
            type: String,
            enum: ['SUPER_ADMIN', 'MILL_ADMIN', 'MILL_STAFF', 'VIEWER'],
            default: 'VIEWER',
        },

        // Embedded Permissions (Only used if role === 'MILL_STAFF')
        permissions: [
            {
                moduleSlug: { type: String, required: true }, // e.g., 'inventory', 'sales'
                actions: [
                    {
                        type: String,
                        enum: ['view', 'create', 'edit', 'delete'],
                    },
                ],
            },
        ],

        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date },
    },
    { timestamps: true }
)
