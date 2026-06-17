import mongoose, { Schema } from "mongoose";

const ConversationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true,
        },

        guestId: {
            type: String,
            default: null,
            index: true,
        },

        title: {
            type: String,
            required: true,
            default: "New conversation",
            trim: true,
        },

        model: {
            type: String,
            default: "default",
            trim: true,
        },

        // Chat mode this conversation was created in
        mode: {
            type: String,
            enum: ["ask", "explore", "idea"],
            default: "ask",
        },

        messageCount: {
            type: Number,
            default: 0,
            min: 0,
        },

        tokensUsedTotal: {
            type: Number,
            default: 0,
            min: 0,
        },

        creditsChargedTotal: {
            type: Number,
            default: 0,
            min: 0,
        },

        archived: {
            type: Boolean,
            default: false,
        },

        lastMessageAt: {
            type: Date,
            default: Date.now,
            index: true,
        },

        // Populated at the end of an Idea Mode session
        ideaSummary: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

ConversationSchema.index({ userId: 1, lastMessageAt: -1 });
ConversationSchema.index({ guestId: 1, lastMessageAt: -1 });

export default mongoose.models.Conversation ||
    mongoose.model("Conversation", ConversationSchema);