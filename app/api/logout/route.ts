import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        (await cookies()).delete("token"); // Delete the token cookie
        return NextResponse.json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json({
            error: "Logout failed",
        }, { status: 500 });
    }
}