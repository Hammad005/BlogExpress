import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { verifyAuth } from "../utils/authMiddleware";
import Comment from "../models/Comment";

export async function GET(req: NextRequest) {
    await dbConnection();
    await verifyAuth(req);
    try {
        const comments = await Comment.find({}).populate("commentOwner", "name profilePics").sort({ createdAt: -1 }); // Populate author field with name and email
        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}