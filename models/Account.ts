import mongoose, { Schema } from "mongoose";

const AccountSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        provider: {
            type: String,
            required: true,
        },
        providerAccountId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

AccountSchema.index(
    {
        provider: 1,
        providerAccountId: 1,
    },
    { unique: true }
);

export default mongoose.models.Account ||
    mongoose.model("Account", AccountSchema);