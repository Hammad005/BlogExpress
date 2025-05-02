import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import Like from "../models/Like";


export async function POST(req: NextRequest) {
    await dbConnection();
    const authResult = await verifyAuth(req);

    const { user } = authResult as AuthSuccess;
    const { likeBlog } = await req.json(); // Expecting an array of pictures

    try {
        
        // Check if the user has already liked the blog
        const existingLike = await Like.findOne({
            likeOwner: user.id,
            likeBlog,
        });
        if (existingLike) {
            return NextResponse.json({ error: "You have already liked this blog" }, { status: 400 });
        }
        // Create a new like
        const newLike = await new Like({
            likeOwner: user.id,
            likeBlog,
        }).save();
        await newLike.populate("likeOwner", "name profilePics");
        return NextResponse.json({ likes: newLike }, { status: 201 });
    } catch (error) {
        console.error("Creating Like Error:", error);
        return NextResponse.json({ error: "Error Creating Like" }, { status: 500 });
    }
}
