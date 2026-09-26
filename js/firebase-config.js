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

// ============================================================
// Shared Constants
// ============================================================

const CLUBS = [
    { name: 'Dance', color: '#E74C3C', textColor: '#fff' },
    { name: 'Theatre', color: '#9B59B6', textColor: '#fff' },
    { name: 'Music', color: '#3498DB', textColor: '#fff' },
    { name: 'Cinematography', color: '#1ABC9C', textColor: '#fff' },
    { name: 'Science', color: '#F39C12', textColor: '#fff' },
    { name: 'Math', color: '#E67E22', textColor: '#fff' },
    { name: 'Art', color: '#2ECC71', textColor: '#fff' },
    { name: 'Literature', color: '#8E44AD', textColor: '#fff' },
    { name: 'E-Game', color: '#16A085', textColor: '#fff' },
    { name: 'Cultural', color: '#D35400', textColor: '#fff' },
    { name: 'E-Cell', color: '#2980B9', textColor: '#fff' },
    { name: 'Alumni Cell', color: '#27AE60', textColor: '#fff' }
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
    return club ? club.color : '#95A5A6';
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
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
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
