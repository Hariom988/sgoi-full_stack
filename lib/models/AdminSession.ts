import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAdminSession extends Document {
  adminId: Types.ObjectId;
  sessionToken: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  userAgent: string;
  ipAddress: string;
}

const AdminSessionSchema = new Schema<IAdminSession>(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
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
      // MongoDB TTL index: automatically deletes documents after expiresAt
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

const AdminSession: Model<IAdminSession> =
  mongoose.models.AdminSession ??
  mongoose.model<IAdminSession>("AdminSession", AdminSessionSchema);

export default AdminSession;