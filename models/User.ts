import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        name: String,

        email: {
            type: String,
            unique: true,
        },

        image: String,

        username: String,

        role: {
            type: String,
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User ||
    mongoose.model("User", UserSchema);