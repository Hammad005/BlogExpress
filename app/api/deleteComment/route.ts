import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import Comment from "../models/Comment";

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
    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ error: "Comment not found or already deleted" }, { status: 404 });
    }
    if (comment.blogOwner.toString() === user.id || comment.commentOwner._id.toString() === user.id) {
        // Delete the comment from the database
        await Comment.findByIdAndDelete(id);
        return NextResponse.json({ message: "Comment deleted successfully"}, { status: 200 });
    } else{
        return NextResponse.json({ error: "You are not authorized to delete this comment" }, { status: 403 });
    }
    
  } catch (error) {
    console.error("Deleting Comment Error:", error);
    return NextResponse.json({ error: "Error Deleting Comment" }, { status: 500 });
  }
    
}

