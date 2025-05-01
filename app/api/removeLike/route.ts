import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import Like from "../models/Like";

export async function DELETE(req: NextRequest) {
  dbConnection();
  const authResult = await verifyAuth(req);

  if ('error' in authResult) {
    return authResult;
  }

  const { user } = authResult as AuthSuccess;
  const body = await req.json();
  const id = body._id

  try {
    const like = await Like.findById(id);
    if (!like) {
        return NextResponse.json({ error: "Like not found or already remove" }, { status: 404 });
    }
    if (like.likeOwner.toString() === user.id) {
        // Delete the comment from the database
        await Like.findByIdAndDelete(id);
        return NextResponse.json({ message: "Like removed successfully"}, { status: 200 });
    } else{
        return NextResponse.json({ error: "You are not authorized to remove this like" }, { status: 403 });
    }
  } catch (error) {
    console.error("Removing Like Error:", error);
    return NextResponse.json({ error: "Error Removing Like" }, { status: 500 });
  }
    
}

