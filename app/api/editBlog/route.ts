import { NextRequest, NextResponse } from "next/server";
import dbConnection from "../db/db";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import Blog from "../models/Blog";


export async function PUT(req: NextRequest) {
  await dbConnection();
  const authResult = await verifyAuth(req);


  const { user } = authResult as AuthSuccess;

  const { blog } = await req.json();
  
  if (blog?.blogOwner._id !== user.id) {
    return NextResponse.json({ error: "You are not authorized to edit this blog!" }, { status: 403 });
  }

    const newData = { 
      blogContent: blog?.blogContent, 
      blogCategory: blog?.blogCategory 
    };
  try {

    // Update user data
    const updatedBlog = await Blog.findByIdAndUpdate(blog?._id, newData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json({ blog: updatedBlog });

  } catch (error) {
    console.error("Updating Profile Error:", error);
    return NextResponse.json({ error: "Error Updating Profile" }, { status: 500 });
  }
}
