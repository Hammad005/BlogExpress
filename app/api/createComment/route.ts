import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import Comment from "../models/Comment";


export async function POST(req: NextRequest) {
    await dbConnection();
    const authResult = await verifyAuth(req);

    const { user } = authResult as AuthSuccess;
    const { blogOwner, commentBlog, comment } = await req.json(); // Expecting an array of pictures
    
    try {
        const newComment = await new Comment({
            commentOwner: user.id,
            blogOwner,
            commentBlog,
            comment
        }).save();
        await newComment.populate("commentOwner", "name profilePics");
        return NextResponse.json({ message: "Comment post successfully", comment: newComment }, { status: 201 });
    } catch (error) {
        console.error("Creating comment Error:", error);
        return NextResponse.json({ error: "Error Creating comment" }, { status: 500 });
    }
}
