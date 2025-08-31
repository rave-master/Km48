import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
  import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

  // Your Firebase config
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
      // If not logged in, redirect to login page
      window.location.href = "/index.html";
    } else {
      console.log("User is signed in:", user.displayName, user.email);
      // Example: show user name on homepage
      document.getElementById("user-info").textContent =
        `Welcome, ${user.displayName || user.email}`;
    }
  });

  // Optional: Logout button
  function logout() {
    signOut(auth).then(() => {
      window.location.href = "/index.html";
    });
  }
  window.logout = logout;




    const AGREEMENT_VERSION = '2.1';

    // Check agreement in storage
    const storedVersion = sessionStorage.getItem('denr_agreement_version');
    const agreementAccepted = sessionStorage.getItem('denr_agreement_accepted');

    if (storedVersion !== AGREEMENT_VERSION || agreementAccepted !== 'true') {
        // Redirect to agreement page if not accepted
        window.location.href = '/index.html'; // Your cover page filename
    }

    function updatePhilippineDateTime() {
  const now = new Date();

  // Format date: "Wednesday, August 20, 2025"
  const dateOptions = {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", dateOptions).format(now);

  // Format time: "11:41:15 AM"
  const timeOptions = {
    timeZone: "Asia/Manila",
    hour12: true,
    hour: "numeric",  // no leading zero
    minute: "2-digit",
    second: "2-digit"
  };
  const formattedTime = new Intl.DateTimeFormat("en-US", timeOptions).format(now);

  document.getElementById("ph-date").textContent = formattedDate;
  document.getElementById("ph-time").textContent = `Philippine Standard Time: ${formattedTime}`;
}
// Update every second
setInterval(updatePhilippineDateTime, 1000);
updatePhilippineDateTime();

let allData = [];
        let filteredData = [];
        let charts = {};
        let currentDate = new Date();

        // API endpoint
        const API_URL = 'https://script.google.com/macros/s/AKfycbyYReWmhvUY-ECqMaSEP2oNft1GzfjK01du-hNdUk_fn5KOaymGcebSDF0KREBzMJzvNQ/exec';

        // Function to normalize text for grouping similar entries
        function normalizeText(text) {
            if (!text || text === 'Unknown') return 'Unknown';
            
            // Convert to lowercase and remove extra spaces
            let normalized = text.toString().toLowerCase().trim();
            
            // Remove common punctuation and special characters
            normalized = normalized.replace(/[.,;:!?()[\]{}'"]/g, '');
            
            // Replace multiple spaces with single space
            normalized = normalized.replace(/\s+/g, ' ');
            
            // Group similar species names
            if (normalized.includes('mahogany') || normalized.includes('mahogani')) {
                return 'Mahogany';
            }
            if (normalized.includes('narra') || normalized.includes('pterocarpus')) {
                return 'Narra';
            }
            if (normalized.includes('teak') || normalized.includes('tectona')) {
                return 'Teak';
            }
            if (normalized.includes('bamboo') || normalized.includes('bambu')) {
                return 'Bamboo';
            }
            if (normalized.includes('pine') || normalized.includes('pinus')) {
                return 'Pine';
            }
            if (normalized.includes('eucalyptus') || normalized.includes('eucalipto')) {
                return 'Eucalyptus';
            }
            if (normalized.includes('acacia')) {
                return 'Acacia';
            }
            if (normalized.includes('rubber') || normalized.includes('goma')) {
                return 'Rubber';
            }
            
            // Group forest product types
            if (normalized.includes('lumber') || normalized.includes('timber') || normalized.includes('wood')) {
                return 'Lumber/Timber';
            }
            if (normalized.includes('log') || normalized.includes('trunk')) {
                return 'Logs';
            }
            if (normalized.includes('plywood') || normalized.includes('ply wood')) {
                return 'Plywood';
            }
            if (normalized.includes('pole') || normalized.includes('post')) {
                return 'Poles/Posts';
            }
            if (normalized.includes('charcoal') || normalized.includes('carbon')) {
                return 'Charcoal';
            }
            if (normalized.includes('firewood') || normalized.includes('fuel wood')) {
                return 'Firewood';
            }
            
            // Group permit types
            if (normalized.includes('transport') || normalized.includes('conveyance')) {
                return 'Transport Permit';
            }
            if (normalized.includes('cutting') || normalized.includes('harvest')) {
                return 'Cutting Permit';
            }
            if (normalized.includes('special') || normalized.includes('sp')) {
                return 'Special Permit';
            }
            
            // Group destinations by city/province keywords
            if (normalized.includes('manila') || normalized.includes('metro manila') || normalized.includes('ncr')) {
                return 'Metro Manila';
            }
            if (normalized.includes('cebu')) {
                return 'Cebu';
            }
            if (normalized.includes('davao')) {
                return 'Davao';
            }
            if (normalized.includes('baguio') || normalized.includes('benguet')) {
                return 'Baguio/Benguet';
            }
            if (normalized.includes('laguna')) {
                return 'Laguna';
            }
            if (normalized.includes('bataan')) {
                return 'Bataan';
            }
            if (normalized.includes('quezon')) {
                return 'Quezon';
            }
            
            // Capitalize first letter of each word for display
            return normalized.split(' ').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }

        // Monthly navigation functions
        function previousMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            filterByCurrentMonth();
        }

        function nextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            filterByCurrentMonth();
        }

        function filterByCurrentMonth() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            filteredData = allData.filter(item => {
                const itemDate = new Date(item['Date']);
                return itemDate.getFullYear() === year && itemDate.getMonth() === month;
            });

            updateCurrentMonthDisplay();
            updateStats();
            updateCharts();
            updateTable();
        }

        function updateCurrentMonthDisplay() {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            document.getElementById('currentMonth').textContent = 
                `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        }

        // Load data from Google Sheets
        async function loadData() {
            try {
                document.getElementById('loadingMessage').style.display = 'block';
                document.getElementById('errorMessage').style.display = 'none';
                document.getElementById('dataTable').style.display = 'none';

                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                allData = data;
                
                // Debug: Log the first few items to see available fields
                console.log('Sample data:', allData.slice(0, 3));
                console.log('Available fields:', allData.length > 0 ? Object.keys(allData[0]) : 'No data');
                
                // Filter by current month on initial load
                filterByCurrentMonth();
                updateFilters();
                
                document.getElementById('loadingMessage').style.display = 'none';
                document.getElementById('dataTable').style.display = 'table';
                
            } catch (error) {
                console.error('Error loading data:', error);
                document.getElementById('loadingMessage').style.display = 'none';
                document.getElementById('errorMessage').style.display = 'block';
                document.getElementById('errorMessage').textContent = 'Failed to load data. Please check your connection and try again.';
            }
        }

        // Update statistics
        function updateStats() {
            const totalPermits = filteredData.length;
            
            // Try different possible field names for CU.M
            const totalVolume = filteredData.reduce((sum, item) => {
                const volume = parseFloat(item['CU.M']) || parseFloat(item['CU.M.']) || parseFloat(item['Volume']) || 0;
                return sum + volume;
            }, 0);
            
            // Try different possible field names for BD.FT
            const totalBdFt = filteredData.reduce((sum, item) => {
                const bdft = parseFloat(item['BD.FT']) || parseFloat(item['BD.FT.']) || parseFloat(item['BDFT']) || 0;
                return sum + bdft;
            }, 0);
            
            // Try different possible field names for pieces
            const totalPieces = filteredData.reduce((sum, item) => {
                const pieces = parseInt(item['No. of Pieces']) || parseInt(item['No of Pieces']) || parseInt(item['Pieces']) || 0;
                return sum + pieces;
            }, 0);

            document.getElementById('totalPermits').textContent = totalPermits.toLocaleString();
            document.getElementById('totalVolume').textContent = totalVolume > 0 ? totalVolume.toFixed(2) : '0.00';
            document.getElementById('totalBdFt').textContent = totalBdFt > 0 ? totalBdFt.toFixed(2) : '0.00';
            document.getElementById('totalPieces').textContent = totalPieces.toLocaleString();
        }

        // Update filter options
        function updateFilters() {
            const destinations = [...new Set(allData.map(item => item['Destination -Address/Location']))].filter(Boolean).sort();
            const cenros = [...new Set(allData.map(item => item['CENRO-Origin']))].filter(Boolean).sort();

            const destinationSelect = document.getElementById('speciesFilter');
            const cenroSelect = document.getElementById('cenroFilter');

            // Clear existing options (except "All")
            destinationSelect.innerHTML = '<option value="">All Destinations</option>';
            cenroSelect.innerHTML = '<option value="">All CENRO</option>';

            destinations.forEach(d => {
                const option = document.createElement('option');
                option.value = d;
                option.textContent = d;
                destinationSelect.appendChild(option);
            });

            cenros.forEach(c => {
                const option = document.createElement('option');
                option.value = c;
                option.textContent = c;
                cenroSelect.appendChild(option);
            });
        }

        // Apply filters
        function applyFilters() {
            const dateFrom = document.getElementById('dateFrom').value;
            const dateTo = document.getElementById('dateTo').value;
            const destination = document.getElementById('speciesFilter').value;
            const cenro = document.getElementById('cenroFilter').value;

            filteredData = allData.filter(item => {
                const itemDate = new Date(item['Date']);
                
                if (dateFrom && itemDate < new Date(dateFrom)) return false;
                if (dateTo && itemDate > new Date(dateTo)) return false;
                if (destination && item['Destination -Address/Location'] !== destination) return false;
                if (cenro && item['CENRO-Origin'] !== cenro) return false;
                
                return true;
            });

            updateStats();
            updateCharts();
            updateTable();
        }

        // Update charts
        function updateCharts() {
            updateSpeciesChart();
            updateMonthlyChart();
            updateDailyChart();
            updateCenroChart();
            updateDestinationChart();
            updatePermitTypeChart();
            updateConsigneeChart();
        }

       function updateSpeciesChart() { 
    const speciesCount = {};
    filteredData.forEach(item => {
        const species = normalizeText(item['Species'] || 'Unknown');
        speciesCount[species] = (speciesCount[species] || 0) + 1;
    });

    const ctx = document.getElementById('speciesChart').getContext('2d');
    
    if (charts.species) {
        charts.species.destroy();
    }

    // 1. Calculate total count
    const total = Object.values(speciesCount).reduce((a, b) => a + b, 0);

    // 2. Convert counts into percentages
    const percentages = Object.values(speciesCount).map(val => ((val / total) * 100).toFixed(2));

    charts.species = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(speciesCount),
            datasets: [{
                data: percentages,
                backgroundColor: [
                    '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
                    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}


        function updateMonthlyChart() {
            const forestProductsCount = {};
            filteredData.forEach(item => {
                const product = normalizeText(item['Kind of Forest Products'] || 'Unknown');
                forestProductsCount[product] = (forestProductsCount[product] || 0) + 1;
            });

            const ctx = document.getElementById('monthlyChart').getContext('2d');
            
            if (charts.monthly) {
                charts.monthly.destroy();
            }

            charts.monthly = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(forestProductsCount),
                    datasets: [{
                        label: 'Count',
                        data: Object.values(forestProductsCount),
                        backgroundColor: [
                            '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
                            '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
                        ],
                        borderColor: [
                            '#2980b9', '#c0392b', '#27ae60', '#e67e22', '#8e44ad',
                            '#16a085', '#2c3e50', '#d35400', '#7f8c8d', '#f39c12'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    }
                }
            });
        }

        function updateDailyChart() {
            const dailyCount = {};
            filteredData.forEach(item => {
                const date = new Date(item['Date']);
                const day = date.getDate();
                dailyCount[day] = (dailyCount[day] || 0) + 1;
            });

            // Create array for all days of the month
            const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
            const labels = [];
            const data = [];
            
            for (let i = 1; i <= daysInMonth; i++) {
                labels.push(i.toString());
                data.push(dailyCount[i] || 0);
            }

            const ctx = document.getElementById('dailyChart').getContext('2d');
            
            if (charts.daily) {
                charts.daily.destroy();
            }

            charts.daily = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Permits per Day',
                        data: data,
                        backgroundColor: 'rgba(46, 204, 113, 0.1)',
                        borderColor: '#2ecc71',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Day of Month'
                            }
                        }
                    }
                }
            });
        }

        function updateCenroChart() {
            const cenroCount = {};
            filteredData.forEach(item => {
                const cenro = item['CENRO-Origin'] || 'Unknown';
                cenroCount[cenro] = (cenroCount[cenro] || 0) + 1;
            });

            const ctx = document.getElementById('cenroChart').getContext('2d');
            
            if (charts.cenro) {
                charts.cenro.destroy();
            }

            charts.cenro = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    labels: Object.keys(cenroCount),
                    datasets: [{
                        data: Object.values(cenroCount),
                        backgroundColor: [
                            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6',
                            '#1abc9c', '#34495e', '#e67e22'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        function updateDestinationChart() {
            const destinationCount = {};
            filteredData.forEach(item => {
                // Try multiple possible field names for destination
                const destination = item['Destination -Address/Location'] || 
                                  item['Destination'] || 
                                  item['Address'] || 
                                  item['Location'] || 
                                  'Unknown';
                const normalizedDestination = normalizeText(destination);
                destinationCount[normalizedDestination] = (destinationCount[normalizedDestination] || 0) + 1;
            });

            const ctx = document.getElementById('destinationChart').getContext('2d');
            
            if (charts.destination) {
                charts.destination.destroy();
            }

            // Sort destinations by count and take top 10 to avoid overcrowding
            const sortedDestinations = Object.entries(destinationCount)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10);

            charts.destination = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedDestinations.map(([dest]) => dest.length > 30 ? dest.substring(0, 30) + '...' : dest),
                    datasets: [{
                        label: 'Permits Count',
                        data: sortedDestinations.map(([,count]) => count),
                        backgroundColor: [
                            '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
                            '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
                        ],
                        borderColor: [
                            '#2980b9', '#c0392b', '#27ae60', '#e67e22', '#8e44ad',
                            '#16a085', '#2c3e50', '#d35400', '#7f8c8d', '#f39c12'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }

        function updatePermitTypeChart() {
    const permitTypeCount = {};
    filteredData.forEach(item => {
        // Try multiple possible field names for permit type
        const permitType = item['Permit Issued  Type'] || 
                         item['Permit Issued Type'] || 
                         item['Permit Type'] || 
                         item['Type'] || 
                         'Unknown';
        const normalizedPermitType = normalizeText(permitType);
        permitTypeCount[normalizedPermitType] = (permitTypeCount[normalizedPermitType] || 0) + 1;
    });

    const ctx = document.getElementById('permitTypeChart').getContext('2d');
    
    if (charts.permitType) {
        charts.permitType.destroy();
    }

    // 1. Calculate total count
    const total = Object.values(permitTypeCount).reduce((a, b) => a + b, 0);

    // 2. Convert counts into percentages
    const percentages = Object.values(permitTypeCount).map(val => ((val / total) * 100).toFixed(2));

    charts.permitType = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(permitTypeCount),
            datasets: [{
                data: percentages,
                backgroundColor: [
                    '#f39c12', '#e74c3c', '#9b59b6', '#3498db', '#2ecc71',
                    '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}
            function updateConsigneeChart() {
            const consigneeVolume = {};
            filteredData.forEach(item => {
                // Try multiple possible field names for consignee
                const consignee = item['NAME OF CONSIGNEE'] || 
                                item['Name of Consignee'] || 
                                item['Consignee'] || 
                                item['Consignee Name'] || 
                                'Unknown';
                
                // Get volume data
                const volume = parseFloat(item['CU.M']) || 
                             parseFloat(item['CU.M.']) || 
                             parseFloat(item['Volume']) || 0;
                
                if (volume > 0) {
                    const normalizedConsignee = normalizeText(consignee);
                    consigneeVolume[normalizedConsignee] = (consigneeVolume[normalizedConsignee] || 0) + volume;
                }
            });

            const ctx = document.getElementById('consigneeChart').getContext('2d');
            
            if (charts.consignee) {
                charts.consignee.destroy();
            }

            // Sort consignees by volume and take top 10 to avoid overcrowding
            const sortedConsignees = Object.entries(consigneeVolume)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 10);

            charts.consignee = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedConsignees.map(([consignee]) => 
                        consignee.length > 25 ? consignee.substring(0, 25) + '...' : consignee
                    ),
                    datasets: [{
                        label: 'Volume (CU.M)',
                        data: sortedConsignees.map(([,volume]) => volume.toFixed(2)),
                        backgroundColor: [
                            '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
                            '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
                        ],
                        borderColor: [
                            '#2980b9', '#c0392b', '#27ae60', '#e67e22', '#8e44ad',
                            '#16a085', '#2c3e50', '#d35400', '#7f8c8d', '#f39c12'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Volume (CU.M)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'CONSIGNEE'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `Volume: ${context.parsed.y} CU.M`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Update table
        function updateTable() {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';

            filteredData.slice(0, 50).forEach(item => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${new Date(item['Date']).toLocaleDateString()}</td>
                    <td>${item['Permittee'] || '-'}</td>
                    <td>${item['Species'] || '-'}</td>
                    <td>${item['No. of Pieces'] || item['No of Pieces'] || item['Pieces'] || '-'}</td>
                    <td>${item['CU.M'] || item['CU.M.'] || item['Volume'] || '-'}</td>
                    <td>${item['BD.FT'] || item['BD.FT.'] || item['BDFT'] || '-'}</td>
                    <td>${item['Conveyance Type'] || '-'}</td>
                    <td>${item['Conveyance Plate No.'] || '-'}</td>
                    <td>${item['CENRO-Origin'] || '-'}</td>
                    <td>${item['Permit Issued  Type'] || '-'}</td>
                `;
                tbody.appendChild(row);
            });
        }

        // Generate PDF Report
        function generatePDFReport() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4' // A4 size (595.28 x 841.89 points)
            });
            
            // Get current month info
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            const currentMonthName = monthNames[currentDate.getMonth()];
            const currentYear = currentDate.getFullYear();
            
            // Helper function to normalize text for grouping (case-insensitive)
            function normalizeForGrouping(text) {
                if (!text || text === 'Unknown' || text === '' || text === null || text === undefined) return 'Unknown';
                return text.toString().toLowerCase().trim().replace(/\s+/g, ' ');
            }
            
            // Helper function to get display name (proper case)
            function getDisplayName(normalizedKey, originalValues) {
                if (normalizedKey === 'unknown') return 'Unknown';
                
                // Find all variants that match the normalized key
                const variants = originalValues.filter(val => {
                    if (!val) return false;
                    return normalizeForGrouping(val) === normalizedKey;
                });
                
                if (variants.length === 0) {
                    // Capitalize first letter of each word
                    return normalizedKey.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                }
                
                // Return the variant that appears most frequently
                const variantCounts = {};
                variants.forEach(variant => {
                    const cleanVariant = variant.toString().trim();
                    if (cleanVariant) {
                        variantCounts[cleanVariant] = (variantCounts[cleanVariant] || 0) + 1;
                    }
                });
                
                const sortedVariants = Object.entries(variantCounts).sort(([,a], [,b]) => b - a);
                return sortedVariants.length > 0 ? sortedVariants[0][0] : normalizedKey;
            }
            
            // Debug: Check if we have data
            console.log('PDF Generation Debug:');
            console.log('All data length:', allData.length);
            console.log('Filtered data length:', filteredData.length);
            console.log('Sample filtered item:', filteredData[0]);
            
            // If no filtered data, use all data for the report
            const reportData = filteredData.length > 0 ? filteredData : allData;
            console.log('Using data length:', reportData.length);
            
            // Check if we have any data at all
            if (reportData.length === 0) {
                alert('No data available to generate PDF report. Please load data first or check your connection.');
                return;
            }
            
            // Calculate statistics
            const totalPermits = reportData.length;
            const totalVolume = reportData.reduce((sum, item) => {
                const volume = parseFloat(item['CU.M']) || parseFloat(item['CU.M.']) || parseFloat(item['Volume']) || 0;
                return sum + volume;
            }, 0);
            const totalBdFt = reportData.reduce((sum, item) => {
                const bdft = parseFloat(item['BD.FT']) || parseFloat(item['BD.FT.']) || parseFloat(item['BDFT']) || 0;
                return sum + bdft;
            }, 0);
            const totalPieces = reportData.reduce((sum, item) => {
                const pieces = parseInt(item['No. of Pieces']) || parseInt(item['No of Pieces']) || parseInt(item['Pieces']) || 0;
                return sum + pieces;
            }, 0);

            // Calculate analytics with case-insensitive grouping
            const speciesCount = {};
            const cenroCount = {};
            const destinationCount = {};
            const permitTypeCount = {};
            const dailyCount = {};
            const consigneeVolume = {};
            
            // Store original values for display name lookup
            const originalSpecies = [];
            const originalCenros = [];
            const originalDestinations = [];
            const originalPermitTypes = [];
            const originalConsignees = [];

            reportData.forEach(item => {
                // Species analysis
                const species = item['Species'] || 'Unknown';
                const normalizedSpecies = normalizeForGrouping(species);
                originalSpecies.push(species);
                speciesCount[normalizedSpecies] = (speciesCount[normalizedSpecies] || 0) + 1;
                
                // CENRO analysis
                const cenro = item['CENRO-Origin'] || 'Unknown';
                const normalizedCenro = normalizeForGrouping(cenro);
                originalCenros.push(cenro);
                cenroCount[normalizedCenro] = (cenroCount[normalizedCenro] || 0) + 1;
                
                // Destination analysis
                const destination = item['Destination -Address/Location'] || 'Unknown';
                const normalizedDestination = normalizeForGrouping(destination);
                originalDestinations.push(destination);
                destinationCount[normalizedDestination] = (destinationCount[normalizedDestination] || 0) + 1;
                
                // Permit type analysis
                const permitType = item['Permit Issued  Type'] || item['Permit Issued Type'] || 'Unknown';
                const normalizedPermitType = normalizeForGrouping(permitType);
                originalPermitTypes.push(permitType);
                permitTypeCount[normalizedPermitType] = (permitTypeCount[normalizedPermitType] || 0) + 1;
                
                // Daily analysis
                const date = new Date(item['Date']);
                const day = date.getDate();
                dailyCount[day] = (dailyCount[day] || 0) + 1;
                
                // Consignee volume analysis
                const consignee = item['NAME OF CONSIGNEE'] || 
                                item['Name of Consignee'] || 
                                item['Consignee'] || 
                                item['Consignee Name'] || 
                                'Unknown';
                const volume = parseFloat(item['CU.M']) || 
                             parseFloat(item['CU.M.']) || 
                             parseFloat(item['Volume']) || 0;
                if (volume > 0) {
                    const normalizedConsignee = normalizeForGrouping(consignee);
                    originalConsignees.push(consignee);
                    consigneeVolume[normalizedConsignee] = (consigneeVolume[normalizedConsignee] || 0) + volume;
                }
            });

            // Define margins: 1 inch left (72pt), 0.5 inch right (36pt)
            const leftMargin = 72;
            const rightMargin = 36;
            const pageWidth = 595.28; // A4 width
            const pageHeight = 841.89; // A4 height
            const textWidth = pageWidth - leftMargin - rightMargin; // Available text width
            const centerX = pageWidth / 2;
            const bottomMargin = 50; // Space for footer
            
            // Helper function to check if we need a new page
            function checkPageBreak(currentY, requiredSpace = 50) {
                if (currentY + requiredSpace > pageHeight - bottomMargin) {
                    doc.addPage();
                    return 50; // Reset to top of new page
                }
                return currentY;
            }
            
            // Start building PDF
            let yPosition = 50;
            
            // Header
            doc.setFontSize(24);
            doc.setFont(undefined, 'bold');
            doc.text('Forest Products Transport Report', centerX, yPosition, { align: 'center' });
            yPosition += 20;
            
            doc.setFontSize(16);
            doc.setFont(undefined, 'normal');
            const reportPeriod = filteredData.length > 0 ? 
                `${currentMonthName} ${currentYear}` : 
                `All Available Data (${reportData.length} records)`;
            doc.text(reportPeriod, centerX, yPosition, { align: 'center' });
            yPosition += 30;

            // Executive Summary
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Executive Summary', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            
            const summaryPeriod = filteredData.length > 0 ? 
                `During ${currentMonthName} ${currentYear}` : 
                `Based on all available data`;
            const summary = `${summaryPeriod}, the forest products transportation system processed a total of ${totalPermits} permits. This represents the movement of ${totalVolume.toFixed(2)} cubic meters (CU.M) and ${totalBdFt.toFixed(2)} board feet (BD.FT) of forest products, comprising ${totalPieces.toLocaleString()} individual pieces.`;
            
            const summaryLines = doc.splitTextToSize(summary, textWidth);
            summaryLines.forEach(line => {
                doc.text(line, leftMargin, yPosition);
                yPosition += 15;
            });
            yPosition += 20;

            // Key Statistics
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Key Performance Indicators', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            doc.text(`• Total Permits Issued: ${totalPermits.toLocaleString()}`, leftMargin + 20, yPosition);
            yPosition += 15;
            doc.text(`• Total Volume Transported: ${totalVolume.toFixed(2)} CU.M`, leftMargin + 20, yPosition);
            yPosition += 15;
            doc.text(`• Total Board Feet: ${totalBdFt.toFixed(2)} BD.FT`, leftMargin + 20, yPosition);
            yPosition += 15;
            doc.text(`• Total Pieces: ${totalPieces.toLocaleString()}`, leftMargin + 20, yPosition);
            yPosition += 15;
            doc.text(`• Average Volume per Permit: ${totalPermits > 0 ? (totalVolume / totalPermits).toFixed(2) : '0.00'} CU.M`, leftMargin + 20, yPosition);
            yPosition += 25;

            // Species Analysis
            yPosition = checkPageBreak(yPosition, 100);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Species Distribution Analysis', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            const topSpecies = Object.entries(speciesCount).sort(([,a], [,b]) => b - a).slice(0, 5);
            const topSpeciesDisplay = topSpecies.map(([normalizedSpecies, count]) => {
                const displayName = getDisplayName(normalizedSpecies, originalSpecies);
                return `${displayName} (${count} permits, ${((count/totalPermits)*100).toFixed(1)}%)`;
            });
            const speciesAnalysis = `The most transported species this month were: ${topSpeciesDisplay.join(', ')}. This distribution indicates the primary forest products being harvested and transported in the region.`;
            
            const speciesLines = doc.splitTextToSize(speciesAnalysis, textWidth);
            speciesLines.forEach(line => {
                yPosition = checkPageBreak(yPosition, 15);
                doc.text(line, leftMargin, yPosition);
                yPosition += 15;
            });
            yPosition += 20;

            // CENRO Analysis
            yPosition = checkPageBreak(yPosition, 100);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('CENRO Origin Analysis', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            const topCenros = Object.entries(cenroCount).sort(([,a], [,b]) => b - a).slice(0, 3);
            const topCenrosDisplay = topCenros.map(([normalizedCenro, count]) => {
                const displayName = getDisplayName(normalizedCenro, originalCenros);
                return `${displayName} (${count} permits)`;
            });
            const cenroAnalysis = `The most active CENRO offices were: ${topCenrosDisplay.join(', ')}. This shows the geographic distribution of forest product activities across different administrative regions.`;
            
            const cenroLines = doc.splitTextToSize(cenroAnalysis, textWidth);
            cenroLines.forEach(line => {
                yPosition = checkPageBreak(yPosition, 15);
                doc.text(line, leftMargin, yPosition);
                yPosition += 15;
            });
            yPosition += 20;

            // Consignee Volume Analysis
            yPosition = checkPageBreak(yPosition, 100);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Consignee Volume Analysis', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            const topConsignees = Object.entries(consigneeVolume).sort(([,a], [,b]) => b - a).slice(0, 5);
            const totalConsigneeVolume = Object.values(consigneeVolume).reduce((a, b) => a + b, 0);
            
            if (topConsignees.length > 0) {
                const topConsigneesDisplay = topConsignees.map(([normalizedConsignee, volume]) => {
                    const displayName = getDisplayName(normalizedConsignee, originalConsignees);
                    const truncatedName = displayName.substring(0, 30) + (displayName.length > 30 ? '...' : '');
                    return `${truncatedName} (${volume.toFixed(2)} CU.M, ${((volume/totalConsigneeVolume)*100).toFixed(1)}%)`;
                });
                const consigneeAnalysis = `The largest consignees by volume were: ${topConsigneesDisplay.join(', ')}. This shows the distribution of forest products among major buyers and processing facilities.`;
                
                const consigneeLines = doc.splitTextToSize(consigneeAnalysis, textWidth);
                consigneeLines.forEach(line => {
                    yPosition = checkPageBreak(yPosition, 15);
                    doc.text(line, leftMargin, yPosition);
                    yPosition += 15;
                });
            } else {
                yPosition = checkPageBreak(yPosition, 15);
                doc.text('No consignee volume data available for this period.', leftMargin, yPosition);
                yPosition += 15;
            }
            yPosition += 20;

            // Destination Analysis
            yPosition = checkPageBreak(yPosition, 100);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Destination Analysis', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            const topDestinations = Object.entries(destinationCount).sort(([,a], [,b]) => b - a).slice(0, 3);
            const topDestinationsDisplay = topDestinations.map(([normalizedDest, count]) => {
                const displayName = getDisplayName(normalizedDest, originalDestinations);
                const truncatedName = displayName.substring(0, 40) + (displayName.length > 40 ? '...' : '');
                return `${truncatedName} (${count} permits)`;
            });
            const destAnalysis = `The primary destinations for forest products were: ${topDestinationsDisplay.join(', ')}. This indicates the main markets and processing facilities receiving forest products.`;
            
            const destLines = doc.splitTextToSize(destAnalysis, textWidth);
            destLines.forEach(line => {
                yPosition = checkPageBreak(yPosition, 15);
                doc.text(line, leftMargin, yPosition);
                yPosition += 15;
            });
            yPosition += 20;

            // Permit Type Analysis
            yPosition = checkPageBreak(yPosition, 100);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Permit Type Distribution', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            const topPermitTypes = Object.entries(permitTypeCount).sort(([,a], [,b]) => b - a);
            const topPermitTypesDisplay = topPermitTypes.map(([normalizedType, count]) => {
                const displayName = getDisplayName(normalizedType, originalPermitTypes);
                return `${displayName} (${count} permits, ${((count/totalPermits)*100).toFixed(1)}%)`;
            });
            const permitAnalysis = `Permit types issued: ${topPermitTypesDisplay.join(', ')}. This breakdown shows the regulatory compliance and types of forest product activities.`;
            
            const permitLines = doc.splitTextToSize(permitAnalysis, textWidth);
            permitLines.forEach(line => {
                yPosition = checkPageBreak(yPosition, 15);
                doc.text(line, leftMargin, yPosition);
                yPosition += 15;
            });
            yPosition += 25;

            // Daily Activity Analysis
            yPosition = checkPageBreak(yPosition, 100);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Daily Activity Pattern', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            const dailyValues = Object.values(dailyCount);
            const avgDaily = dailyValues.length > 0 ? (dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length).toFixed(1) : 0;
            const maxDaily = Math.max(...dailyValues, 0);
            const activeDays = Object.keys(dailyCount).length;
            
            const dailyAnalysis = `Forest product transportation showed ${activeDays} active days during the month, with an average of ${avgDaily} permits per active day. The peak activity day recorded ${maxDaily} permits, indicating ${maxDaily > avgDaily * 1.5 ? 'significant variation' : 'consistent activity'} in daily operations.`;
            
            const dailyLines = doc.splitTextToSize(dailyAnalysis, textWidth);
            dailyLines.forEach(line => {
                yPosition = checkPageBreak(yPosition, 15);
                doc.text(line, leftMargin, yPosition);
                yPosition += 15;
            });
            yPosition += 25;

            // Recommendations
            yPosition = checkPageBreak(yPosition, 150);
            doc.setFontSize(14);
            doc.setFont(undefined, 'bold');
            doc.text('Recommendations & Insights', leftMargin, yPosition);
            yPosition += 20;
            
            doc.setFontSize(12);
            doc.setFont(undefined, 'normal');
            
            let recommendations = [];
            
            if (totalPermits > 100) {
                recommendations.push('High permit volume indicates active forest industry - consider streamlining processes for efficiency.');
            }
            
            if (topSpecies.length > 0 && topSpecies[0][1] / totalPermits > 0.5) {
                const topSpeciesDisplayName = getDisplayName(topSpecies[0][0], originalSpecies);
                recommendations.push(`${topSpeciesDisplayName} dominates transportation (${((topSpecies[0][1]/totalPermits)*100).toFixed(1)}%) - monitor for sustainable harvesting.`);
            }
            
            if (activeDays < 20) {
                recommendations.push('Transportation activity concentrated in fewer days - consider workload distribution optimization.');
            }
            
            if (recommendations.length === 0) {
                recommendations.push('Current forest product transportation patterns appear balanced and sustainable.');
            }
            
            recommendations.forEach(rec => {
                const recLines = doc.splitTextToSize(`• ${rec}`, textWidth - 20);
                recLines.forEach(line => {
                    yPosition = checkPageBreak(yPosition, 15);
                    doc.text(line, leftMargin + 20, yPosition);
                    yPosition += 15;
                });
                yPosition += 5;
            });

            // Footer
            yPosition = checkPageBreak(yPosition, 50);
            yPosition += 20;
            doc.setFontSize(10);
            doc.setFont(undefined, 'italic');
            doc.text(`Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, centerX, yPosition, { align: 'center' });
            doc.text('Forest Products Transport Dashboard - Automated Monthly Report', centerX, yPosition + 15, { align: 'center' });

            // Save the PDF
            const filename = filteredData.length > 0 ? 
                `Forest_Products_Report_${currentMonthName}_${currentYear}.pdf` :
                `Forest_Products_Report_All_Data_${new Date().toISOString().slice(0,10)}.pdf`;
            doc.save(filename);
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            loadData();
        });

        (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'96f7f3b7c164094a',t:'MTc1NTI1MzE0OS4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
