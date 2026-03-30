/**
 * Exotel Outbound SDK Interface
 * 
 * This server-side utility library securely wraps the Exotel REST HTTP APIs. 
 * Use these functions inside any Next.js API Routes (Server Actions) to trigger
 * real-world Outbound Calls or SMS broadcasts securely without leaking keys to the frontend.
 */

const getExotelConfig = () => {
   const sid = process.env.EXOTEL_ACCOUNT_SID;
   const key = process.env.EXOTEL_API_KEY;
   const token = process.env.EXOTEL_API_TOKEN;
   const subdomain = process.env.EXOTEL_SUBDOMAIN || "api.exotel.com";
 
   if (!sid || !key || !token) {
     throw new Error("Missing Exotel Authentication Keys in .env.local file.");
   }
 
   // Exotel APIs require Base64 standard Basic Authorization
   const auth = Buffer.from(`${key}:${token}`).toString("base64");
   
   return { sid, auth, subdomain };
 };
 
 /**
  * Send an outbound SMS to a student or volunteer.
  * @param to Phone number to text (e.g., "09876543210")
  * @param message The exact string content of the SMS.
  * @param exotelCallerId Your purchased Exotel Virtual Number acting as sender.
  */
 export async function sendExotelSMS(to: string, message: string, exotelCallerId: string) {
   const { sid, auth, subdomain } = getExotelConfig();
   const url = `https://${subdomain}/v1/Accounts/${sid}/Sms/send.json`;
 
   const formData = new URLSearchParams();
   formData.append("From", exotelCallerId);
   formData.append("To", to);
   formData.append("Body", message);
 
   console.log(`[EXOTEL API] Broadcasting SMS to ${to}...`);
   const response = await fetch(url, {
     method: "POST",
     headers: {
       "Authorization": `Basic ${auth}`,
       "Content-Type": "application/x-www-form-urlencoded"
     },
     body: formData.toString()
   });
 
   if (!response.ok) {
     const errorBody = await response.text();
     throw new Error(`Exotel SMS API Error: ${response.status} - ${errorBody}`);
   }
 
   return await response.json();
 }
 
 /**
  * Automatically Call a user and instantly drop them into an App Builder Flow.
  * Perfect for scheduling automated "Session Reminder" voice calls.
  * 
  * @param to Phone number to call (e.g., "09876543210")
  * @param exotelCallerId Your valid Exotel Virtual Number to display.
  * @param flowId Your Exotel App-Builder ID (e.g., "345981")
  */
 export async function triggerOutboundCall(to: string, exotelCallerId: string, flowId: string) {
   const { sid, auth, subdomain } = getExotelConfig();
   
   // We hit the standard Calls.json endpoint
   const url = `https://${subdomain}/v1/Accounts/${sid}/Calls/connect.json`;
 
   const formData = new URLSearchParams();
   formData.append("From", to); // In Exotel Outbound Connect, 'From' is the user we are physically calling!
   formData.append("CallerId", exotelCallerId); // The number seen on their screen
   
   // The App-Builder flow they inherently connect to when they pick up the phone
   formData.append("Url", `http://my.exotel.com/${sid}/exoml/start_voice/${flowId}`); 
 
   console.log(`[EXOTEL API] Triggering Outbound App flow for ${to}...`);
   const response = await fetch(url, {
     method: "POST",
     headers: {
       "Authorization": `Basic ${auth}`,
       "Content-Type": "application/x-www-form-urlencoded"
     },
     body: formData.toString()
   });
 
   if (!response.ok) {
     const errorBody = await response.text();
     throw new Error(`Exotel Call Connect API Error: ${response.status} - ${errorBody}`);
   }
 
   return await response.json();
 }
