// firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyD2xLVGe79OxzEHC2uXNMcbCtWugGn2M_k",
  authDomain: "simple-logon.firebaseapp.com",
  projectId: "simple-logon",
  storageBucket: "simple-logon.firebasestorage.app",
  messagingSenderId: "698709393716",
  appId: "1:698709393716:web:5d93c85f962769d8a42561",
  measurementId: "G-H25FHTK2S5"
};

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Loader & Alert Helpers ---
function showLoader() { document.getElementById("loadingModal").classList.remove("hidden"); }
function hideLoader() { document.getElementById("loadingModal").classList.add("hidden"); }
function showAlert(title, message) {
  const modal = document.getElementById("alertModal");
  document.getElementById("alertTitle").textContent = title;
  document.getElementById("alertMessage").textContent = message;
  modal.classList.remove("hidden");
}
document.getElementById("alertClose").addEventListener("click", () => {
  document.getElementById("alertModal").classList.add("hidden");
});

// --- Auto-create Firestore User Profile ---
async function createUserProfileIfNotExists(user) {
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      role: "user" // default role
    });
  }
}

// --- Admin Check ---
async function isAdmin(user) {
  if (!user) return false;
  const adminRef = doc(db, "admin", user.uid);
  const adminSnap = await getDoc(adminRef);
  return adminSnap.exists();
}

// --- Email Login ---
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const tokenEl = document.querySelector("[name='cf-turnstile-response']");
  if (!tokenEl || !tokenEl.value) { showAlert("Error", "Please complete the CAPTCHA."); return; }
  if (!email || !password) { showAlert("Error", "Please enter both email and password."); return; }

  showLoader();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Auto-create profile if missing
    await createUserProfileIfNotExists(user);

    // Check admin role
    if (await isAdmin(user)) {
      hideLoader();
      showAlert("Success", "Admin login successful! Redirecting...");
      setTimeout(() => window.location.href = "/home/index.html", 1500);
    } else {
      hideLoader();
      showAlert("Success", "Login successful! Redirecting...");
      setTimeout(() => window.location.href = "/agreement/", 1500);
    }

  } catch (error) {
    hideLoader();
    showAlert("Error", error.message);
  }
});

// --- Google Login ---
const googleProvider = new GoogleAuthProvider();
document.getElementById("googleLogin").addEventListener("click", async () => {
  showLoader();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await createUserProfileIfNotExists(user);

    if (await isAdmin(user)) {
      hideLoader();
      showAlert("Success", "Admin login successful! Redirecting...");
      setTimeout(() => window.location.href = "/home/index.html", 1500);
    } else {
      hideLoader();
      showAlert("Success", "Login successful! Redirecting...");
      setTimeout(() => window.location.href = "/agreement/", 1500);
    }

  } catch (error) {
    hideLoader();
    showAlert("Error", error.message);
  }
});

// --- Facebook Login ---
const facebookProvider = new FacebookAuthProvider();
document.getElementById("facebookLogin").addEventListener("click", async () => {
  showLoader();
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const user = result.user;

    await createUserProfileIfNotExists(user);

    if (await isAdmin(user)) {
      hideLoader();
      showAlert("Success", "Admin login successful! Redirecting...");
      setTimeout(() => window.location.href = "/home/index.html", 1500);
    } else {
      hideLoader();
      showAlert("Success", "Login successful! Redirecting...");
      setTimeout(() => window.location.href = "/agreement/", 1500);
    }

  } catch (error) {
    hideLoader();
    showAlert("Error", error.message);
  }
});

// --- Password Reset ---
document.getElementById("resetSend").addEventListener("click", async () => {
  const resetEmail = document.getElementById("resetEmail").value.trim();
  if (!resetEmail) { showAlert("Error", "Please enter your email address."); return; }

  showLoader();
  try {
    await sendPasswordResetEmail(auth, resetEmail);
    hideLoader();
    document.getElementById("forgotPasswordModal").classList.add("hidden");
    showAlert("Success", "Password reset link sent to your email.");
  } catch (error) {
    hideLoader();
    showAlert("Error", error.message);
  }
});

// --- Optional: Keep user signed in and redirect ---
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await createUserProfileIfNotExists(user);
    if (await isAdmin(user)) {
      window.location.href = "/home/index.html";
    } else {
      window.location.href = "/agreement/";
    }
  }
});
