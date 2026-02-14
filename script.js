// ===========================
// Real Configuration - Ramadan 2025
// ===========================
const CONFIG = {
    city: 'Karachi',
    country: 'Pakistan',
    latitude: 24.8607,
    longitude: 67.0011,
    timezone: 'Asia/Karachi',
    
    // REAL RAMADAN 2025 DATES
    // Ramadan 1446 AH starts on Monday, 17 February 2025
    ramadanStartDate: new Date('2025-02-17T00:00:00+05:00'), // PKT timezone
    
    // Calculation method: 1 = University of Islamic Sciences, Karachi
    calculationMethod: 1
};

// ===========================
// Global Variables
// ===========================
let ramadanTimings = [];
let currentRamadanDay = 0;
let countdownInterval = null;
let isRamadanActive = false;

// ===========================
// Get Current Date in PKT
// ===========================
function getCurrentPKTDate() {
    // Get current date in Pakistan timezone
    const now = new Date();
    const pktTime = new Date(now.toLocaleString('en-US', { timeZone: CONFIG.timezone }));
    return pktTime;
}

// ===========================
// Theme Management
// ===========================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const toggle = document.getElementById('themeToggle');
    if (theme === 'dark') {
        toggle.style.transform = 'rotate(180deg)';
    } else {
        toggle.style.transform = 'rotate(0deg)';
    }
}

// ===========================
// Fetch Real Prayer Times from API
// ===========================
async function fetchPrayerTimes(date) {
    try {
        const timestamp = Math.floor(date.getTime() / 1000);
        const url = `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${CONFIG.latitude}&longitude=${CONFIG.longitude}&method=${CONFIG.calculationMethod}`;
        
        console.log('Fetching prayer times for:', date.toLocaleDateString());
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code !== 200) {
            throw new Error('Invalid API response');
        }
        
        return data.data;
    } catch (error) {
        console.error('Error fetching prayer times:', error);
        return null;
    }
}

// ===========================
// Calculate All Ramadan Timings (Real API Data)
// ===========================
async function calculateRamadanTimings() {
    console.log('Starting to fetch real Ramadan timings from API...');
    ramadanTimings = [];
    const startDate = new Date(CONFIG.ramadanStartDate);
    
    // Show loading message
    updateTableLoading(true);
    
    for (let day = 0; day < 30; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + day);
        
        const prayerData = await fetchPrayerTimes(currentDate);
        
        if (prayerData) {
            ramadanTimings.push({
                day: day + 1,
                date: currentDate,
                gregorianDate: prayerData.date.gregorian.date,
                gregorianDay: prayerData.date.gregorian.day,
                gregorianMonth: prayerData.date.gregorian.month.en,
                gregorianYear: prayerData.date.gregorian.year,
                hijriDate: `${prayerData.date.hijri.day} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year}`,
                hijriDay: prayerData.date.hijri.day,
                hijriMonth: prayerData.date.hijri.month.en,
                hijriYear: prayerData.date.hijri.year,
                sehri: prayerData.timings.Fajr,
                iftar: prayerData.timings.Maghrib,
                sunrise: prayerData.timings.Sunrise,
                dhuhr: prayerData.timings.Dhuhr,
                asr: prayerData.timings.Asr,
                isha: prayerData.timings.Isha,
            });
            
            console.log(`Day ${day + 1}: Sehri ${prayerData.timings.Fajr}, Iftar ${prayerData.timings.Maghrib}`);
        } else {
            console.error(`Failed to fetch data for day ${day + 1}`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    console.log(`Successfully loaded ${ramadanTimings.length} days of timings`);
    updateTableLoading(false);
    
    return ramadanTimings;
}

// ===========================
// Update Table Loading State
// ===========================
function updateTableLoading(isLoading) {
    const tbody = document.getElementById('timetableBody');
    if (isLoading) {
        tbody.innerHTML = `
            <tr class="loading-row">
                <td colspan="5" style="text-align: center; padding: 40px;">
                    <div class="loader"></div>
                    <div style="margin-top: 15px;">Fetching real prayer timings from Aladhan API...</div>
                    <div style="margin-top: 10px; font-size: 0.9rem; color: var(--text-secondary);">This may take a moment...</div>
                </td>
            </tr>
        `;
    }
}

// ===========================
// Determine Current Ramadan Status
// ===========================
function getCurrentRamadanDay() {
    const now = getCurrentPKTDate();
    const startDate = new Date(CONFIG.ramadanStartDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 29); // 30 days total
    
    // Before Ramadan
    if (now < startDate) {
        isRamadanActive = false;
        return 0;
    } 
    // After Ramadan
    else if (now > endDate) {
        isRamadanActive = false;
        return -1;
    } 
    // During Ramadan
    else {
        isRamadanActive = true;
        const diffTime = Math.abs(now - startDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays + 1;
    }
}

// ===========================
// Update Current Day Display
// ===========================
function updateCurrentDayDisplay() {
    currentRamadanDay = getCurrentRamadanDay();
    const dayElement = document.getElementById('currentRamadanDay');
    const hijriElement = document.getElementById('hijriDate');
    const gregorianElement = document.getElementById('gregorianDate');
    const statusBadge = document.getElementById('statusBadge');
    const statusText = document.getElementById('statusText');
    const todaySection = document.getElementById('todayTimingsSection');
    
    const now = getCurrentPKTDate();
    
    if (currentRamadanDay > 0 && currentRamadanDay <= 30) {
        // During Ramadan
        dayElement.textContent = currentRamadanDay;
        statusBadge.style.display = 'inline-flex';
        statusText.textContent = `Day ${currentRamadanDay} of Ramadan`;
        todaySection.style.display = 'block';
        
        const todayTiming = ramadanTimings.find(t => t.day === currentRamadanDay);
        if (todayTiming) {
            hijriElement.textContent = todayTiming.hijriDate;
            gregorianElement.textContent = `${todayTiming.gregorianDay} ${todayTiming.gregorianMonth} ${todayTiming.gregorianYear}`;
            document.getElementById('todaySehri').textContent = formatTime(todayTiming.sehri);
            document.getElementById('todayIftar').textContent = formatTime(todayTiming.iftar);
        }
    } else if (currentRamadanDay === 0) {
        // Before Ramadan
        const daysUntil = Math.ceil((CONFIG.ramadanStartDate - now) / (1000 * 60 * 60 * 24));
        dayElement.textContent = '⏳';
        hijriElement.textContent = 'Ramadan 1446 AH';
        gregorianElement.textContent = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        statusBadge.style.display = 'inline-flex';
        statusText.textContent = `Ramadan starts in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`;
        todaySection.style.display = 'none';
    } else {
        // After Ramadan
        dayElement.textContent = '✓';
        hijriElement.textContent = 'Ramadan Completed';
        gregorianElement.textContent = 'May Allah accept your fasting';
        statusBadge.style.display = 'inline-flex';
        statusText.textContent = 'Ramadan 1446 Complete - Eid Mubarak!';
        todaySection.style.display = 'none';
    }
}

// ===========================
// Real Countdown Timer
// ===========================
function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    countdownInterval = setInterval(() => {
        updateCountdown();
    }, 1000);
    
    updateCountdown(); // Initial call
}

function updateCountdown() {
    const now = getCurrentPKTDate();
    const countdownLabel = document.getElementById('countdownLabel');
    const countdownIcon = document.getElementById('countdownIcon');
    const countdownMessage = document.getElementById('countdownMessage');
    const daysElement = document.getElementById('days');
    
    // Show/hide days based on status
    if (currentRamadanDay === 0) {
        daysElement.parentElement.style.display = 'flex';
    } else {
        daysElement.parentElement.style.display = 'none';
    }
    
    if (currentRamadanDay === 0) {
        // Before Ramadan - countdown to start
        const targetTime = new Date(CONFIG.ramadanStartDate);
        const timeDiff = targetTime - now;
        
        if (timeDiff > 0) {
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            
            countdownLabel.textContent = 'Time Until Ramadan Begins';
            countdownIcon.textContent = '🌙';
            countdownMessage.textContent = 'Get ready for the blessed month!';
            
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        }
        
    } else if (currentRamadanDay > 0 && currentRamadanDay <= 30) {
        // During Ramadan - countdown to next Sehri or Iftar
        const todayTiming = ramadanTimings.find(t => t.day === currentRamadanDay);
        if (!todayTiming) return;
        
        const [sehriHour, sehriMin] = todayTiming.sehri.split(':').map(s => parseInt(s.trim()));
        const [iftarHour, iftarMin] = todayTiming.iftar.split(':').map(s => parseInt(s.trim()));
        
        const sehriTime = new Date(now);
        sehriTime.setHours(sehriHour, sehriMin, 0, 0);
        
        const iftarTime = new Date(now);
        iftarTime.setHours(iftarHour, iftarMin, 0, 0);
        
        let targetTime, targetName, targetIcon, message;
        
        if (now < sehriTime) {
            // Before Sehri
            targetTime = sehriTime;
            targetName = 'Time Until Sehri Ends';
            targetIcon = '🌙';
            message = 'Wake up for Suhoor!';
        } else if (now < iftarTime) {
            // After Sehri, before Iftar
            targetTime = iftarTime;
            targetName = 'Time Until Iftar';
            targetIcon = '🌅';
            message = 'May your fast be accepted!';
        } else {
            // After Iftar - count to tomorrow's Sehri
            const tomorrowTiming = ramadanTimings.find(t => t.day === currentRamadanDay + 1);
            if (tomorrowTiming) {
                const [nextSehriHour, nextSehriMin] = tomorrowTiming.sehri.split(':').map(s => parseInt(s.trim()));
                targetTime = new Date(now);
                targetTime.setDate(targetTime.getDate() + 1);
                targetTime.setHours(nextSehriHour, nextSehriMin, 0, 0);
                targetName = 'Time Until Tomorrow\'s Sehri';
                targetIcon = '🌙';
                message = 'Prepare for tomorrow\'s fast!';
            } else {
                // Last day after Iftar
                countdownLabel.textContent = 'Ramadan Complete!';
                countdownIcon.textContent = '🎉';
                countdownMessage.textContent = 'Eid Mubarak!';
                setCountdownZero();
                return;
            }
        }
        
        const timeDiff = targetTime - now;
        
        if (timeDiff <= 0) {
            setCountdownZero();
            return;
        }
        
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        
        countdownLabel.textContent = targetName;
        countdownIcon.textContent = targetIcon;
        countdownMessage.textContent = message;
        
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
    } else {
        // After Ramadan
        countdownLabel.textContent = 'Ramadan 1446 Complete';
        countdownIcon.textContent = '🎉';
        countdownMessage.textContent = 'Eid Mubarak! May Allah accept your fasting and prayers.';
        setCountdownZero();
    }
}

function setCountdownZero() {
    const daysElement = document.getElementById('days');
    if (daysElement.parentElement.style.display !== 'none') {
        document.getElementById('days').textContent = '00';
    }
    document.getElementById('hours').textContent = '00';
    document.getElementById('minutes').textContent = '00';
    document.getElementById('seconds').textContent = '00';
}

// ===========================
// Populate Timetable with Real Data
// ===========================
function populateTimetable() {
    const tbody = document.getElementById('timetableBody');
    tbody.innerHTML = '';
    
    if (ramadanTimings.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px; color: var(--text-secondary);">
                    No timings loaded. Please refresh the page.
                </td>
            </tr>
        `;
        return;
    }
    
    ramadanTimings.forEach(timing => {
        const row = document.createElement('tr');
        
        // Highlight current day
        if (timing.day === currentRamadanDay) {
            row.classList.add('current-day');
        }
        
        row.innerHTML = `
            <td>${timing.day}</td>
            <td>${timing.hijriDay} ${timing.hijriMonth}</td>
            <td>${timing.gregorianDay} ${timing.gregorianMonth} ${timing.gregorianYear}</td>
            <td>${formatTime(timing.sehri)}</td>
            <td>${formatTime(timing.iftar)}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// ===========================
// Utility Functions
// ===========================
function formatTime(time24) {
    // Remove timezone info if present (e.g., "05:30 (PKT)")
    const cleanTime = time24.split(' ')[0];
    const [hours, minutes] = cleanTime.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
}

function formatDate(date) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
}

// ===========================
// Initialize App with Real Data
// ===========================
async function initializeApp() {
    console.log('=================================');
    console.log('Ramadan Timings 2025 - Karachi');
    console.log('=================================');
    console.log('Ramadan starts: 17 February 2025');
    console.log('Fetching real prayer times...');
    console.log('=================================');
    
    // Set theme
    initTheme();
    
    // Set city name
    document.getElementById('cityName').textContent = `${CONFIG.city}, ${CONFIG.country}`;
    
    // Show loading state
    document.body.classList.add('loading');
    
    try {
        // Calculate all Ramadan timings from API
        await calculateRamadanTimings();
        
        // Update displays
        updateCurrentDayDisplay();
        populateTimetable();
        startCountdown();
        
        console.log('=================================');
        console.log('App initialized successfully!');
        console.log(`Current Ramadan day: ${currentRamadanDay}`);
        console.log('=================================');
        
    } catch (error) {
        console.error('Error initializing app:', error);
        alert('Failed to load prayer timings. Please check your internet connection and refresh the page.');
    } finally {
        // Remove loading state
        document.body.classList.remove('loading');
    }
}

// ===========================
// Event Listeners
// ===========================
document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
    
    // Initialize app
    initializeApp();
    
    // Update current day every hour (in case of day change)
    setInterval(() => {
        const newDay = getCurrentRamadanDay();
        if (newDay !== currentRamadanDay) {
            console.log('Day changed! Updating displays...');
            updateCurrentDayDisplay();
            populateTimetable();
        }
    }, 3600000); // Check every hour
});

// ===========================
// Service Worker Registration
// ===========================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('Service Worker registered'))
            .catch(() => console.log('Service Worker registration failed'));
    });
}

// ===========================
// Visibility Change Handler
// ===========================
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Tab became visible - update countdown
        updateCountdown();
    }
});
