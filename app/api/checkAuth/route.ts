import { NextRequest, NextResponse } from "next/server";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import dbConnection from "../db/db";

export async function GET(request: NextRequest) {
  await dbConnection();
    const authResult = await verifyAuth(request);
  
    if ('error' in (authResult )) {
      return authResult; // return 401 response if unauthorized
    }
  
    const { user } = authResult as AuthSuccess; // Type assertion to get user
  
    return NextResponse.json({
      user,
    });
}