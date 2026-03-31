import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/db";

// Force fresh build timestamp: 2026-03-31 06:34 AM

/**
 * NEW Exotel IVR Webhook Endpoint
 * 
 * Path: /api/ivr
 * Use this in your Exotel PassThru Applet!
 * https://vidyastaan.vercel.app/api/ivr?From={From}&To={To}
 */
export async function GET(req: Request) {
  return handleIvrRequest(req);
}

export async function POST(req: Request) {
  return handleIvrRequest(req);
}

async function handleIvrRequest(req: Request) {
  const url = new URL(req.url);
  let callerId = "";

  try {
    // 1. Extract the caller number
    if (req.method === 'GET') {
      callerId = url.searchParams.get('From') || "Unknown";
    } else {
       const formData = await req.formData().catch(() => null);
       if (formData) {
         callerId = formData.get('From') as string || "Unknown";
       }
    }

    // 2. Data Sanitization (Extract last 10 digits as a core)
    const cleanCallerId = callerId.replace(/\D/g, ''); 
    const core10Digits = cleanCallerId.slice(-10);

    if (cleanCallerId === "Unknown" || cleanCallerId.length < 5) {
       console.log("[IVR] Received unknown or placeholder caller ID.");
       return new NextResponse('User Not Registered', { status: 404 });
    }

    console.log(`[IVR] Checking Database for number: ${cleanCallerId} (Core: ${core10Digits})`);
    
    // We search across all likely formats in one go
    const searchTerms = Array.from(new Set([
        cleanCallerId, 
        core10Digits, 
        `+91${core10Digits}`, 
        `0${core10Digits}`
    ]));

    // 3. SECURE FIREBASE DATABASE CHECK
    const usersRef = collection(db, COLLECTIONS.USERS);
    const q = query(usersRef, where("phone", "in", searchTerms));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        // Fallback: Check the dedicated students collection
        console.log(`[IVR] Not found in USERS. Checking STUDENTS fallback...`);
        const studentsRef = collection(db, COLLECTIONS.STUDENTS);
        const q2 = query(studentsRef, where("phone", "in", searchTerms));
        const snap2 = await getDocs(q2);
        
        if (snap2.empty) {
            console.log(`[IVR] ❌ Number definitively NOT REGISTERED.`);
            return new NextResponse('User Not Registered', { 
                status: 404, 
                headers: { 'Content-Type': 'text/plain', 'X-Debug-Matched-Phone': cleanCallerId } 
            });
        }
    }

    // 4. APPROVED Match!
    console.log(`[IVR] ✅ SUCCESS: Registered child/family found!`);
    
    // Return standard "OK" for Exotel's success branch
    return new NextResponse('OK', { 
       status: 200, 
       headers: { 'Content-Type': 'text/plain' } 
    });

  } catch (error) {
    console.error("Critical error in IVR Router:", error);
    // If the server configuration itself is missing (no Firebase keys), we error here.
    return new NextResponse("Server Configuration Error", { status: 500 });
  }
}
