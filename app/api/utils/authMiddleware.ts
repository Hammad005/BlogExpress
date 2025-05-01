import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import User from '../models/User';
import dbConnection from '../db/db';

export type AuthSuccess = { user: typeof User.prototype };
export async function verifyAuth(request: NextRequest) {
  await dbConnection();
  const tokenCookie = request.cookies.get('token');  
  const token = tokenCookie?.value;

  if (!token) throw new Error('Unauthorized - No Token Provided');

  let decoded: string | JwtPayload;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string);
  } catch (error) {
    console.error(error);
    throw new Error('Unauthorized - Invalid Token');
  }

  if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized - User not found' }, { status: 401 });
    }
    return { user }; // return the user to the route handler
  }

  throw new Error('Unauthorized - Invalid Token');
}
