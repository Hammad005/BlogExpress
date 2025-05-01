import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import cloudinary from "../lib/cloudinary";
import Blog from "../models/Blog";


export async function POST(req: NextRequest) {
    await dbConnection();
    const authResult = await verifyAuth(req);

    if ('error' in authResult) {
        return authResult;
    }

    const { user } = authResult as AuthSuccess;
    const { blogPics, blogContent, blogCategory } = await req.json(); // Expecting an array of pictures
    const uploadedPics = await Promise.all(blogPics.map((pic: string) => cloudinary.uploader.upload(pic, {
        folder: "BlogExpress/Blogs"
    })));
    const blogPicsData = uploadedPics.map(uploadResponse => {
        if (!uploadResponse || uploadResponse.error) {
            throw new Error(uploadResponse.error || "Unknown Cloudinary Error");
        }
        return {
            picId: uploadResponse.public_id,
            picUrl: uploadResponse.secure_url,
            dateTime: new Date(),
        };
    });
    try {
        const newBlog = new Blog({
            blogPics: blogPicsData,
            blogOwner: user.id,
            blogContent,
            blogCategory,
        });
        await newBlog.save();
        return NextResponse.json({ message: "Blog post successfully", blog: newBlog }, { status: 201 });
    } catch (error) {
        console.error("Creating Blog Error:", error);
        return NextResponse.json({ error: "Error Creating Blog" }, { status: 500 });
    }
}
