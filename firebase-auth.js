import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAnalytics
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

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
const auth = getAuth();

// --- Email Login ---
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    showAlert("Error", "Please enter both email and password.");
    return;
  }

  showLoader();
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      hideLoader();
      showAlert("Success", "Login successful! Redirecting...");
      console.log("User:", userCredential.user);
      setTimeout(() => window.location.href = "/agreement/", 1500);
    })
    .catch(error => {
      hideLoader();
      showAlert("Error", error.message);
    });
});

// --- Google Login ---
const googleProvider = new GoogleAuthProvider();
document.getElementById("googleLogin").addEventListener("click", () => {
  showLoader();
  signInWithPopup(auth, googleProvider)
    .then(result => {
      hideLoader();
      showAlert("Success", "Google login successful!");
      console.log(result.user);
      setTimeout(() => window.location.href = "/agreement/", 1500);
    })
    .catch(error => {
      hideLoader();
      showAlert("Error", error.message);
    });
});

// --- Facebook Login ---
const facebookProvider = new FacebookAuthProvider();
document.getElementById("facebookLogin").addEventListener("click", () => {
  showLoader();
  signInWithPopup(auth, facebookProvider)
    .then(result => {
      hideLoader();
      showAlert("Success", "Facebook login successful!");
      console.log(result.user);
      setTimeout(() => window.location.href = "/agreement/", 1500);
    })
    .catch(error => {
      hideLoader();
      showAlert("Error", error.message);
    });
});

// --- Password Reset ---
document.getElementById("resetSend").addEventListener("click", () => {
  const resetEmail = document.getElementById("resetEmail").value.trim();
  if (!resetEmail) {
    showAlert("Error", "Please enter your email address.");
    return;
  }

  showLoader();
  sendPasswordResetEmail(auth, resetEmail)
    .then(() => {
      hideLoader();
      document.getElementById("forgotPasswordModal").classList.add("hidden");
      showAlert("Success", "Password reset link sent to your email.");
    })
    .catch(error => {
      hideLoader();
      showAlert("Error", error.message);
    });
});
