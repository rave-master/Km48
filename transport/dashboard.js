// ---------------- Firebase ----------------
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD2xLVGe79OxzEHC2uXNMcbCtWugGn2M_k",
  authDomain: "simple-logon.firebaseapp.com",
  projectId: "simple-logon",
  storageBucket: "simple-logon.firebasestorage.app",
  messagingSenderId: "698709393716",
  appId: "1:698709393716:web:5d93c85f962769d8a42561",
  measurementId: "G-H25FHTK2S5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Protect the page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "/index.html";
  } else {
    console.log("User is signed in:", user.displayName, user.email);
    const userInfo = document.getElementById("user-info");
    userInfo.textContent = `Welcome, ${user.displayName || user.email}`;
    if (user.photoURL) {
      const img = document.createElement("img");
      img.src = user.photoURL;
      img.alt = "Profile Picture";
      img.style.width = "32px";
      img.style.height = "32px";
      img.style.borderRadius = "50%";
      img.style.marginLeft = "8px";
      userInfo.appendChild(img);
    }
  }
});

// Logout function
function logout() {
  signOut(auth).then(() => {
    window.location.href = "/index.html";
  });
}
window.logout = logout;

// ---------------- Agreement Check ----------------
const AGREEMENT_VERSION = '2.1';
const storedVersion = sessionStorage.getItem('denr_agreement_version');
const agreementAccepted = sessionStorage.getItem('denr_agreement_accepted');
if (storedVersion !== AGREEMENT_VERSION || agreementAccepted !== 'true') {
  window.location.href = '/index.html';
}

// ---------------- Philippine Date/Time ----------------
function updatePhilippineDateTime() {
  const now = new Date();
  const dateOptions = {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const timeOptions = {
    timeZone: "Asia/Manila",
    hour12: true,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  };
  document.getElementById("ph-date").textContent =
    new Intl.DateTimeFormat("en-US", dateOptions).format(now);
  document.getElementById("ph-time").textContent =
    "Philippine Standard Time: " + new Intl.DateTimeFormat("en-US", timeOptions).format(now);
}
setInterval(updatePhilippineDateTime, 1000);
updatePhilippineDateTime();

// ---------------- Dashboard Logic ----------------
const DATA_URL = "https://script.google.com/macros/s/AKfycbyYReWmhvUY-ECqMaSEP2oNft1GzfjK01du-hNdUk_fn5KOaymGcebSDF0KREBzMJzvNQ/exec";

let allData = [];
let currentMonthIndex = 0;
let monthList = [];
let map, markerClusterGroup;

// --- Helpers ---
function convertDriveLink(url) {
  if (!url) return "";
  if (url.includes("open?id=")) return url.replace("open?id=", "uc?export=view&id=");
  const match = url.match(/\/d\/([^\/]+)\/?/);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : url;
}

function formatDate(value) {
  if (!value) return "";
  let d;
  if (!isNaN(value) && value > 1000 && value < 60000) {
    d = new Date((value - 25569) * 86400 * 1000);
  } else {
    d = new Date(value);
  }
  if (isNaN(d.getTime())) return value || "";
  const isMidnight = d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0;
  const options = isMidnight
    ? { timeZone: "Asia/Singapore", year: "numeric", month: "short", day: "2-digit" }
    : { timeZone: "Asia/Singapore", year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
  return d.toLocaleString("en-US", options).toUpperCase();
}

function formatNumber(value, decimals = 2) {
  if (isNaN(Number(value))) return value || "";
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

// --- Map setup ---
function initMap() {
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  markerClusterGroup = L.markerClusterGroup();
  map.addLayer(markerClusterGroup);
}

function addLocationsToMap(data) {
  markerClusterGroup.clearLayers();
  const bounds = [];
  data.forEach(row => {
    const loc = row["location"] || row["Location"];
    if (!loc) return;
    const permittee = row["permittee"] || row["Permittee"] || "";
    const species = row["species"] || row["Species"] || "";
    const popupHtml = `<div style="font-weight:600">${escapeHtml(permittee || "Record")}</div><div style="font-size:90%">${escapeHtml(species || "Record")}</div>`;
    const parts = String(loc).split(",");
    if (parts.length >= 2) {
      const lat = parseFloat(parts[0]);
      const lng = parseFloat(parts[1]);
      if (!isNaN(lat) && !isNaN(lng)) {
        const m = L.marker([lat, lng]).bindPopup(popupHtml);
        markerClusterGroup.addLayer(m);
        bounds.push([lat, lng]);
      }
    }
  });
  if (bounds.length) map.fitBounds(bounds, { padding: [20, 20] });
}

// --- Table rendering ---
function renderTable() {
  if (!allData.length) return;
  const headers = Object.keys(allData[0]);
  const tableHeader = document.getElementById("tableHeader");
  const tableBody = document.getElementById("tableBody");
  const tableFooter = document.getElementById("tableFooter");
  tableHeader.innerHTML = "";
  tableBody.innerHTML = "";
  tableFooter.innerHTML = "";

  // Build header row
  headers.forEach(h => {
    const th = document.createElement("th");
    th.textContent = h.toUpperCase();
    tableHeader.appendChild(th);
  });

  // Active month label
  const month = monthList[currentMonthIndex] || null;
  document.getElementById("monthLabel").textContent = month ? formatMonthLabel(month).toUpperCase() : "--";

  const dateKey = headers.find(k => k.toLowerCase().includes("date")) || headers[0];
  const cuKey = headers.find(k => k.toLowerCase().includes("cu.m"));
  const bdKey = headers.find(k => k.toLowerCase().includes("bd.ft"));
  const piecesKey = headers.find(k => k.toLowerCase().includes("pieces"));

  let totalCu = 0, totalBd = 0, totalPieces = 0;

  const filteredData = allData.filter(row => {
    const d = new Date(row[dateKey]);
    return !isNaN(d) && `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` === month;
  });

  document.getElementById("noDataMessage").style.display = filteredData.length ? "none" : "block";

  filteredData.forEach(row => {
    const tr = document.createElement("tr");
    headers.forEach(h => {
      const key = h.trim().toLowerCase();
      const td = document.createElement("td");
      if (key.includes("photo")) {
        const url = row[h];
        if (url) {
          const img = document.createElement("img");
          img.src = convertDriveLink(url);
          img.loading = "lazy";
          img.onclick = () => window.open(url, "_blank");
          td.appendChild(img);
        }
      } else if (key.includes("timestamp")) {
        const localTime = formatDate(row[h]);
        td.innerHTML = `${row[h]}<br><small style="color:gray;">${localTime}</small>`;
      } else if (key.includes("date")) {
        td.textContent = formatDate(row[h]);
      } else {
        td.textContent = row[h] || "";
      }
      tr.appendChild(td);
    });
    tableBody.appendChild(tr);

    totalCu += parseFloat(row[cuKey]) || 0;
    totalBd += parseFloat(row[bdKey]) || 0;
    totalPieces += parseInt(row[piecesKey]) || 0;
  });

  // Footer totals
  const footerRow = document.createElement("tr");
  headers.forEach((h, idx) => {
    const key = h.toLowerCase();
    const td = document.createElement("td");
    if (key.includes("cu.m")) {
      td.textContent = formatNumber(totalCu) + " CU.M.";
      td.classList.add('right-align');
    } else if (key.includes("bd.ft")) {
      td.textContent = formatNumber(totalBd) + " BD.FT";
      td.classList.add('right-align');
    } else if (key.includes("pieces")) {
      td.textContent = formatNumber(totalPieces, 0) + " PIECES";
      td.classList.add('right-align');
    } else if (idx === 0) {
      td.textContent = "TOTAL:";
    }
    footerRow.appendChild(td);
  });
  tableFooter.appendChild(footerRow);

  addLocationsToMap(filteredData);
}

// --- Month Navigation ---
function changeMonth(step) {
  if (!monthList.length) return;
  currentMonthIndex = Math.min(Math.max(currentMonthIndex + step, 0), monthList.length - 1);
  renderTable();
}

function formatMonthLabel(monthStr) {
  if (!monthStr) return "--";
  const [year, month] = monthStr.split("-");
  return `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`;
}

// --- Search filter ---
function filterTable() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  document.querySelectorAll("#dataTable tbody tr").forEach(row => {
    const cells = Array.from(row.getElementsByTagName("td"));
    row.style.display = cells.some(cell => cell.textContent.toLowerCase().includes(searchValue)) ? "" : "none";
  });
}
window.filterTable = filterTable;
window.changeMonth = changeMonth;

// --- Load data ---
fetch(DATA_URL)
  .then(res => res.json())
  .then(data => {
    allData = data.map(row => {
      const obj = {};
      Object.keys(row).forEach(k => obj[k.trim()] = row[k]);
      return obj;
    });

    const dateKeyCandidate = Object.keys(allData[0] || {}).find(k => k.toLowerCase().includes("date")) || Object.keys(allData[0])[0];

    // Build month list sorted chronologically
    monthList = [...new Set(allData.map(r => {
      const d = new Date(r[dateKeyCandidate]);
      if (isNaN(d)) return null;
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    }).filter(Boolean))].sort((a, b) => {
      return new Date(a + "-01") - new Date(b + "-01");
    });

    // Find current month index
    const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`;
    currentMonthIndex = monthList.indexOf(thisMonth);
    if (currentMonthIndex === -1) currentMonthIndex = monthList.length - 1;

    initMap();
    renderTable();
  });

// Row highlight on click
document.addEventListener("click", function(e) {
  const row = e.target.closest("tr");
  if (!row || row.parentNode.tagName === "THEAD") return; // ignore header
  
  // Remove highlight from all rows
  document.querySelectorAll("tr").forEach(r => r.classList.remove("selected-row"));

  // Highlight clicked row
  row.classList.add("selected-row");
});





// ---------------- Disable Right Click / Inspect ----------------
document.addEventListener("contextmenu", e => e.preventDefault());
document.onkeydown = function(e) {
  if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0))) {
    return false;
  }
};
