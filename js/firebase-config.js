// ============================================================
// Firebase Configuration
// ============================================================
// TODO: Replace with your Firebase project configuration
// Get these values from Firebase Console → Project Settings → Your apps → Web app
const firebaseConfig = {
    apiKey: "AIzaSyBnEgf_TovGTWVc9iqDY4S2zOU_hns4XPQ",
    authDomain: "cebs-calendar.firebaseapp.com",
    projectId: "cebs-calendar",
    storageBucket: "cebs-calendar.firebasestorage.app",
    messagingSenderId: "1055786734147",
    appId: "1:1055786734147:web:9dd1d48bb28ce8428bfaf6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// ============================================================
// Shared Constants
// ============================================================

// Club colours: one family of muted "screen-print" inks with similar
// depth, so they read as a set on the cream paper and all carry white text.
const CLUBS = [
    { name: 'Dance',          color: '#C4513A', textColor: '#fff' }, // terracotta
    { name: 'Theatre',        color: '#7A3B69', textColor: '#fff' }, // plum
    { name: 'Music',          color: '#2F5D8A', textColor: '#fff' }, // denim
    { name: 'Cinematography', color: '#2A6B5C', textColor: '#fff' }, // bottle green
    { name: 'Science',        color: '#B06A12', textColor: '#fff' }, // ochre
    { name: 'Math',           color: '#4D5566', textColor: '#fff' }, // graphite
    { name: 'Art',            color: '#5E7A2C', textColor: '#fff' }, // moss
    { name: 'Literature',     color: '#86603A', textColor: '#fff' }, // old-book tan
    { name: 'E-Game',         color: '#5B3FA0', textColor: '#fff' }, // violet
    { name: 'Cultural',       color: '#B23A55', textColor: '#fff' }, // rose
    { name: 'E-Cell',         color: '#1F6F86', textColor: '#fff' }, // petrol
    { name: 'Alumni Cell',    color: '#2B2A7A', textColor: '#fff' }  // CEBS indigo
];

const VENUES = [
    { value: 'Prefabs', label: 'Prefabs', needsDetail: true, detailLabel: 'Room Number', detailType: 'text', detailPlaceholder: 'e.g. 101' },
    { value: 'Takshashila Mess', label: 'Takshashila Mess', needsDetail: false },
    { value: 'Takshashila Gym', label: 'Takshashila Gym', needsDetail: false },
    { value: 'Nalanda Cafeteria', label: 'Nalanda Cafeteria', needsDetail: false },
    { value: 'NH Stadium', label: 'NH Stadium', needsDetail: false },
    { value: 'University Location', label: 'University Location', needsDetail: true, detailLabel: 'Specify Location', detailType: 'text', detailPlaceholder: 'e.g. Main Gate Area' },
    { value: 'Auditorium', label: 'Auditorium', needsDetail: true, detailLabel: 'Select Auditorium', detailType: 'select', options: ['Green Technology Auditorium', 'Marathi Bhasha Bhavan'] },
    { value: 'Other', label: 'Other', needsDetail: true, detailLabel: 'Specify Venue', detailType: 'text', detailPlaceholder: 'Enter venue name' }
];

// Email domain restriction
// TODO: Replace with your college email domain
const ALLOWED_EMAIL_DOMAIN = 'cbs.ac.in';

// Cloudflare Turnstile site key
// TODO: Replace with your Turnstile site key from https://dash.cloudflare.com/ → Turnstile
const TURNSTILE_SITE_KEY = 'YOUR_TURNSTILE_SITE_KEY';

// ============================================================
// Helper Functions
// ============================================================

function getClubColor(clubName) {
    const club = CLUBS.find(c => c.name === clubName);
    return club ? club.color : '#1E1B3A';
}

function getClubTextColor(clubName) {
    const club = CLUBS.find(c => c.name === clubName);
    return club ? club.textColor : '#fff';
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function formatTime(time24) {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return hour12 + ':' + m + ' ' + ampm;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
    }
    return dateStr;
}

function getVenueDisplay(venue, venueDetails) {
    if (venueDetails) {
        if (venue === 'Prefabs') return 'Prefabs — Room ' + venueDetails;
        if (venue === 'Auditorium') return venueDetails;
        if (venue === 'University Location') return 'University — ' + venueDetails;
        if (venue === 'Other') return venueDetails;
        return venue + ' — ' + venueDetails;
    }
    return venue;
}

/**
 * Check if two time ranges overlap.
 * Times are strings in "HH:MM" 24-hour format.
 */
function timesOverlap(startA, endA, startB, endB) {
    return startA < endB && startB < endA;
}
