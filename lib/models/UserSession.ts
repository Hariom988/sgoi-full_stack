import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUserSession extends Document {
  userId: Types.ObjectId;
  sessionToken: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  userAgent: string;
  ipAddress: string;
}

const UserSessionSchema = new Schema<IUserSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionToken: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lastActivityAt: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    userAgent: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const UserSession: Model<IUserSession> =
  mongoose.models.UserSession ??
  mongoose.model<IUserSession>("UserSession", UserSessionSchema);

export default UserSession;
