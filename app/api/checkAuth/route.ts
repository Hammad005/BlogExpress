import { NextRequest, NextResponse } from "next/server";
import { AuthSuccess, verifyAuth } from "../utils/authMiddleware";
import dbConnection from "../db/db";

export async function GET(request: NextRequest) {
  await dbConnection();
  
  try {
      const { user } = await verifyAuth(request) as AuthSuccess;
      return NextResponse.json({ user });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
}