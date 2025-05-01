import mongoose, { Document, Schema } from "mongoose";

export interface IprofilePics {
    profileId?: string;
    profileImage?: string;
    dateTime?: Date;
}

interface IUser extends Document {
    profilePics: IprofilePics[]; // Array of profile picture objects
    name: string;
    email: string;
    bio: string;
    password: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>({
    profilePics: {
        type: [
            {
                profileId: { type: String, required: false },
                profileImage: { type: String, required: false },
                dateTime: {type: Date, default: Date.now()}
            },
        ],
        default: [],
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    bio: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"],
    },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;