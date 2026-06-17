import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
    },
    image: {
      type: String,
      default: null,
    },

    // For anonymous users
    guestId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },

    isGuest: {
      type: Boolean,
      default: false,
    },

    plan: {
      type: String,
      enum: [
        "guest_free",
        "authenticated_free",
        "purchase_2",
        "purchase_5",
        "purchase_10",
      ],
      required: true,
      default: "guest_free",
    },

    creditsRemaining: {
      type: Number,
      required: true,
      default: 0,
    },

    creditsSpentTotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    creditsPurchasedTotal: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    lastSeenAt: {
      type: Date,
      default: Date.now,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);