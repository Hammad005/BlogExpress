import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../../db/db";
import User from "../../models/User";
import { AuthSuccess, verifyAuth } from "../../utils/authMiddleware";
import cloudinary from "../../lib/cloudinary";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  dbConnection();
  const authResult = await verifyAuth(req);

  if ('error' in authResult) {
    return authResult;
  }

  const { user } = authResult as AuthSuccess;
  const { id } = await params;
  console.log(id.toString());
  
  try {
    const updateUser = await User.findById(user.id);
    if (updateUser && Array.isArray(updateUser.profilePic)) {
      // Find the matching image by profileId
      const profileImageObj = updateUser.profilePic.find(
        (pic: { profileId: string }) => pic.profileId === id.toString()
      );

      // Delete existing profile pic on Cloudinary if it exists
      if (profileImageObj) {
        await cloudinary.uploader.destroy(profileImageObj.publicId);  // Assuming you stored publicId when uploading
      }

      // Remove the photo entry from the array
      updateUser.profilePic = updateUser.profilePic.filter(
        (pic: { profileId: string }) => pic.profileId !== id
      );

      await updateUser.save();
    }

    return NextResponse.json({ message: "Photo deleted successfully", user: updateUser });

  } catch (error) {
    console.error("Deleting Photo Error:", error);
    return NextResponse.json({ error: "Error Deleting Photo" }, { status: 500 });
  }
}

