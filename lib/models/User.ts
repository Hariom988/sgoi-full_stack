import mongoose, { Schema, Document, Model } from "mongoose";

export type AuthProvider = "credentials" | "google";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  authProvider: AuthProvider;
  googleId?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [EMAIL_REGEX, "Invalid email address."],
    },
    passwordHash: {
      type: String,
      select: false,
    },
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      required: true,
      default: "credentials",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "user",
  },
);

const credentialsConnection = mongoose.connection.useDb("credentials", {
  useCache: true,
});

const User: Model<IUser> =
  credentialsConnection.models.User ??
  credentialsConnection.model<IUser>("User", UserSchema);

export default User;
