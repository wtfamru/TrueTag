import { NextResponse } from "next/server";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(request: Request) {
  const { uid, role } = await request.json();
  
  try {
    await admin.auth().setCustomUserClaims(uid, { role });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting custom claims:", error);
    return NextResponse.json({ error: "Failed to set role" }, { status: 500 });
  }
}