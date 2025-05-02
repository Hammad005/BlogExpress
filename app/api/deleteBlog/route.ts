import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import cloudinary from "../lib/cloudinary";
import Blog from "../models/Blog";
import Comment from "../models/Comment";
import Like from "../models/Like";

export async function DELETE(req: NextRequest) {
  dbConnection();
  const authResult = await verifyAuth(req);


  const { user } = authResult as AuthSuccess;
  const body = await req.json();
  const id = body._id

  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found or already deleted" }, { status: 404 });
    }
    if (blog.blogOwner.toString() !== user.id) {
      return NextResponse.json({ error: "Unauthorized to delete this blog" }, { status: 403 });
    }
    // Delete images from Cloudinary
    if (blog.blogPics && Array.isArray(blog.blogPics)) {
      for (const pic of blog.blogPics) {
        if (pic.picId) {
          await cloudinary.uploader.destroy(pic.picId);
        }
      }
    }
    await Comment.deleteMany({ commentBlog: id });
    await Like.deleteMany({ likeBlog: id });
    // Delete the blog from the database
    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Deleting Blog Error:", error);
    return NextResponse.json({ error: "Error Deleting Blog" }, { status: 500 });
  }
    
}

