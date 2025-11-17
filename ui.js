// --- Google Analytics ---
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-H25FHTK2S5');

// --- Disable Right Click & Inspect ---
document.addEventListener("contextmenu", e => e.preventDefault());
document.onkeydown = function (e) {
  if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0))) return false;
};

// --- Password Toggle ---
const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");
if (togglePassword && password) {
  togglePassword.addEventListener("click", () => {
    const type = password.type === "password" ? "text" : "password";
    password.type = type;
    togglePassword.textContent = type === "password" ? "👁️" : "🙈";
  });
}

// --- Tabs ---
const tabEmail = document.getElementById("tab-email");
const tabSocial = document.getElementById("tab-social");
const emailLogin = document.getElementById("email-login");
const socialLogin = document.getElementById("social-login");

tabEmail.addEventListener("click", () => {
  emailLogin.classList.remove("hidden");
  socialLogin.classList.add("hidden");
  tabEmail.classList.add("border-green-600", "text-black");
  tabSocial.classList.remove("border-green-600", "text-black");
  tabSocial.classList.add("text-gray-500");
});

tabSocial.addEventListener("click", () => {
  socialLogin.classList.remove("hidden");
  emailLogin.classList.add("hidden");
  tabSocial.classList.add("border-green-600", "text-black");
  tabEmail.classList.remove("border-green-600", "text-black");
  tabEmail.classList.add("text-gray-500");
});

// --- Helper functions for modals ---
window.showLoader = () => document.getElementById("loadingModal").classList.remove("hidden");
window.hideLoader = () => document.getElementById("loadingModal").classList.add("hidden");
window.showAlert = (title, message) => {
  document.getElementById("alertTitle").textContent = title;
  document.getElementById("alertMessage").textContent = message;
  document.getElementById("alertModal").classList.remove("hidden");
};
document.getElementById("alertClose").addEventListener("click", () => {
  document.getElementById("alertModal").classList.add("hidden");
});

// --- Forgot Password Modal ---
const forgotLink = document.getElementById("forgotPasswordLink");
const forgotModal = document.getElementById("forgotPasswordModal");
const resetCancel = document.getElementById("resetCancel");

forgotLink.addEventListener("click", e => {
  e.preventDefault();
  forgotModal.classList.remove("hidden");
});
resetCancel.addEventListener("click", () => forgotModal.classList.add("hidden"));

// --- Turnstile verification on email login ---
document.getElementById("loginBtn").addEventListener("click", () => {
  const tokenEl = document.querySelector("[name='cf-turnstile-response']");
  if (!tokenEl || !tokenEl.value) {
    showAlert("Error", "Please complete the CAPTCHA.");
    return false;
  }
});
