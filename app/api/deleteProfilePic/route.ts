import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import User, { IprofilePics } from "../models/User";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import cloudinary from "../lib/cloudinary";

export async function PUT(req: NextRequest) {
  dbConnection();
  const authResult = await verifyAuth(req);

  const { user } = authResult as AuthSuccess;
  const body = await req.json();
  const id = body.id
  
  try {
    const updateUser = await User.findById(user.id);
    if (updateUser && Array.isArray(updateUser.profilePics)) {
      // Try to find the matching image using filter
      const matchingPics = updateUser.profilePics.filter(
        (pic: IprofilePics) => pic.profileId === id
      );
    
      if (matchingPics.length === 0) {
        console.log(`No image found for profileId: ${id}`);
        return NextResponse.json({ error: "Profile image not found" }, { status: 404 });
      }
    
      const profileImageObj = matchingPics[0];
    
      // Delete from Cloudinary if it has a publicId or use profileImage URL
      if (profileImageObj?.profileImage) {
        await cloudinary.uploader.destroy(profileImageObj.profileId);
      }
    
      // Filter out the one to delete
      updateUser.profilePics = updateUser.profilePics.filter(
        (pic: IprofilePics) => pic.profileId !== id
      );
    
      await updateUser.save();
    
      return NextResponse.json({ message: "Photo deleted successfully", user: updateUser });
    }

    return NextResponse.json({ message: "Photo deleted successfully", user: updateUser });

  } catch (error) {
    console.error("Deleting Photo Error:", error);
    return NextResponse.json({ error: "Error Deleting Photo" }, { status: 500 });
  }
}

