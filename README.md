# 🌙 Ramadan Timings 2025 - Karachi

**Real prayer timings for Ramadan 1446 AH / 2025 CE**

Beautiful, responsive web application with **REAL** Sehri & Iftar timings fetched from Aladhan API, live countdown timer, and authentic Islamic theme.

## ✨ Features (ALL REAL DATA!)

- ✅ **REAL Ramadan Dates** - Ramadan starts Monday, 17 February 2025
- ✅ **REAL Prayer Timings** - Fetched from Aladhan API for Karachi
- ✅ **REAL Countdown** - Live countdown updates every second
- ✅ **Current Date Aware** - Knows today is 14 Feb, shows "3 days until Ramadan"
- ✅ **Complete 30 Days** - All dates and timings from API
- ✅ **Beautiful Islamic Design** - Mosque silhouettes, crescent moon, lanterns
- ✅ **Dark/Light Mode** - Toggle between themes
- ✅ **Fully Responsive** - Perfect on mobile, tablet, desktop
- ✅ **Authentic Calculation** - Uses University of Islamic Sciences, Karachi method

## 📅 Important Dates

- **Ramadan Starts**: Monday, 17 February 2025 (1 Ramadan 1446 AH)
- **Today**: 14 February 2025
- **Days Until Ramadan**: 3 days

## 🚀 Quick Start

### Method 1: Direct Browser
1. Extract the ZIP file
2. Open `index.html` in your browser
3. Done! (Needs internet for API calls)

### Method 2: Termux
```bash
# Extract and navigate
unzip ramadan-timings.zip
cd ramadan-timings

# Start server
python -m http.server 8000

# Open browser
http://localhost:8000
```

## 🌐 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel login
vercel

# Your site will be live in 2 minutes!
```

## 🔧 How It Works

1. **Real API Integration**: Fetches prayer times from `api.aladhan.com`
2. **Karachi Specific**: Uses coordinates (24.8607, 67.0011)
3. **Authentic Method**: Calculation method 1 (University of Islamic Sciences, Karachi)
4. **Real-time Updates**: Countdown updates every second
5. **Smart Detection**: Knows if Ramadan hasn't started, is active, or has ended

## 📊 Technical Details

- **API**: Aladhan Prayer Times API
- **Location**: Karachi, Pakistan (PKT timezone)
- **Calculation Method**: Method 1 (UIS, Karachi)
- **Ramadan Year**: 1446 AH
- **Start Date**: 2025-02-17
- **Total Days**: 30

## 🎨 Customization

All settings in `script.js`:

```javascript
const CONFIG = {
    city: 'Karachi',
    latitude: 24.8607,
    longitude: 67.0011,
    ramadanStartDate: new Date('2025-02-17T00:00:00+05:00'),
    calculationMethod: 1
};
```

## 📱 Browser Support

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers

## 🔍 Features Breakdown

### Real Countdown
- Before Ramadan: Shows days/hours/minutes/seconds until start
- During Ramadan: Switches between Sehri and Iftar countdowns
- After Ramadan: Shows completion message

### Real Timings
- Sehri = Fajr prayer time (last time to eat)
- Iftar = Maghrib prayer time (time to break fast)
- All times in 12-hour format (AM/PM)

### Real Dates
- Islamic (Hijri) dates
- Gregorian dates
- Current day highlighting

## 🌟 What Makes This Special

Unlike fake/demo timings, this website:
1. **Fetches REAL data** from authentic Islamic API
2. **Knows the actual date** (today is 14 Feb 2025)
3. **Counts down accurately** (3 days until Ramadan)
4. **Updates automatically** as time passes
5. **Shows correct dates** for Ramadan 2025

## 📞 Support

If timings don't load:
1. Check internet connection (API needs internet)
2. Open browser console (F12) for error messages
3. Refresh the page
4. Wait 30 seconds (API might be slow)

## 🤲 May Allah Accept

> اللَّهُمَّ تَقَبَّلْ مِنَّا صِيَامَنَا وَقِيَامَنَا

"O Allah, accept our fasting and our prayers"

---

**Ramadan Mubarak 2025!** 🌙
May your fasts be accepted and your prayers answered.
