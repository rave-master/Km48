const functions = require("firebase-functions");
const fetch = require("node-fetch");

// Cloudflare Turnstile Verification Function
exports.verifyTurnstile = functions.https.onCall(async (data, context) => {
  const token = data.token;

  if (!token) {
    return { success: false, error: "No token provided" };
  }

  // IMPORTANT: Replace with your NEW rotated Turnstile secret key
  const secretKey = "0x4AAAAAACBTBqlC7dy5oyJ4FaEWSkLIeA4";

  const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({
      secret: secretKey,
      response: token,
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  });

  const outcome = await result.json();
  return outcome; // Sends { success: true/false, ... }
});
