import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import User from "../models/User";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import cloudinary from "../lib/cloudinary";

export async function PUT(req: NextRequest) {
    dbConnection();
    const authResult = await verifyAuth(req);

    if ("error" in authResult) {
        return authResult;
    }

    const { user } = authResult as AuthSuccess;

    const { profilePics } = await req.json(); // Expecting a single picture
    
    try {
        // Handle Profile Pic Upload if provided
        if (profilePics) {
            const uploadResponse = await cloudinary.uploader.upload(profilePics, {
                folder: "BlogExpress/Profiles",
            });

            if (!uploadResponse || uploadResponse.error) {
                throw new Error(uploadResponse.error || "Unknown Cloudinary Error");
            }

            const uploadedPic = {
                profileId: uploadResponse.public_id,
                profileImage: uploadResponse.secure_url,
            };
            // Fetch the user and update the profilePics array
            const updatedUser = await User.findById(user.id);

            if (!updatedUser) {
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const existingPics = updatedUser.profilePics || [];
            updatedUser.profilePics = [uploadedPic, ...existingPics];
            await updatedUser.save();
            
            return NextResponse.json({ 
                message: "Profile updated successfully", 
                user: updatedUser 
            });
        }

        return NextResponse.json({ error: "No profile picture provided" }, { status: 400 });
    } catch (error) {
        console.error("Updating Profile Error:", error);
        return NextResponse.json({ error: "Error Updating Profile" }, { status: 500 });
    }
}
