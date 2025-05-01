import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { verifyAuth } from "../utils/authMiddleware";
import Like from "../models/Like";

export async function GET(req: NextRequest) {
    await dbConnection();
    const authResult = await verifyAuth(req);

    if ('error' in authResult) {
        return authResult;
    }
    try {
        const likes = await Like.find({}).populate("likeOwner", "name profilePics").sort({ createdAt: -1 }); // Populate author field with name and email
        return NextResponse.json(likes, { status: 200 });
    } catch (error) {
        console.error("Fetching Likes Error:", error);
        return NextResponse.json({ error: "Error Fetching Likes" }, { status: 500 });
    }
}