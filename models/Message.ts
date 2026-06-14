import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },

    role: {
      type: String,
      enum: ["system", "user", "assistant", "tool"],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: false,
    },

    tokenCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    creditsCharged: {
      type: Number,
      default: 0,
      min: 0,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

MessageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.models.Message || mongoose.model("Message", MessageSchema);
