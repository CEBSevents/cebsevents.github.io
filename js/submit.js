let currentTurnstileToken = null;
let currentEventData = null;

// Views
const formView = document.getElementById('form-view');
const clashView = document.getElementById('clash-view');
const successView = document.getElementById('success-view');

// Form Elements
const eventForm = document.getElementById('event-form');
const clubSelect = document.getElementById('clubName');
const venueSelect = document.getElementById('venue');
const venueDetailContainer = document.getElementById('venue-detail-container');
const venueDetailLabel = document.getElementById('venue-detail-label');
const venueDetailInputArea = document.getElementById('venue-detail-input-area');
const eventDateInput = document.getElementById('eventDate');
const startTimeInput = document.getElementById('startTime');
const endTimeInput = document.getElementById('endTime');
const btnSubmit = document.getElementById('btn-submit');
const formErrorMsg = document.getElementById('form-error-msg');

document.addEventListener('DOMContentLoaded', () => {
    // Set min date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    eventDateInput.min = `${yyyy}-${mm}-${dd}`;

    // Populate Venues
    venueSelect.innerHTML = '<option value="" disabled selected>Select Venue</option>';
    VENUES.forEach(v => {
        const opt = document.createElement('option');
        opt.value = v.value;
        opt.textContent = v.label;
        venueSelect.appendChild(opt);
    });

    // Event Listeners
    venueSelect.addEventListener('change', handleVenueChange);
    eventForm.addEventListener('submit', handleFormSubmit);
    document.getElementById('btn-back-edit').addEventListener('click', showFormView);
    document.getElementById('btn-submit-anyway').addEventListener('click', () => submitEvent(true));
    document.getElementById('btn-submit-another').addEventListener('click', resetForm);
    document.getElementById('btn-copy-link').addEventListener('click', copyLink);

    // Init Auth
    initAuth({
        requireAuth: true,
        onReady: onAuthReady
    });
});

function onAuthReady(user, userData) {
    if (!user || !userData) return;
    
    // Populate Clubs
    clubSelect.innerHTML = '<option value="" disabled selected>Select Club</option>';
    
    if (userData.role === 'admin') {
        CLUBS.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.name;
            opt.textContent = c.name;
            clubSelect.appendChild(opt);
        });
        clubSelect.value = userData.clubName || '';
    } else {
        const opt = document.createElement('option');
        opt.value = userData.clubName;
        opt.textContent = userData.clubName;
        clubSelect.appendChild(opt);
        clubSelect.value = userData.clubName;
    }

    // Set Turnstile Sitekey (if configured)
    const tsWidget = document.getElementById('turnstile-widget');
    if (tsWidget && TURNSTILE_SITE_KEY && TURNSTILE_SITE_KEY !== 'YOUR_TURNSTILE_SITE_KEY') {
        tsWidget.setAttribute('data-sitekey', TURNSTILE_SITE_KEY);
    } else {
        // Turnstile not configured — enable submit button directly
        btnSubmit.disabled = false;
        if (tsWidget) tsWidget.style.display = 'none';
    }
}

function handleVenueChange() {
    const selectedVal = venueSelect.value;
    const venueObj = VENUES.find(v => v.value === selectedVal);
    
    venueDetailContainer.classList.add('d-none');
    venueDetailInputArea.innerHTML = '';
    
    if (venueObj && venueObj.needsDetail) {
        venueDetailContainer.classList.remove('d-none');
        venueDetailLabel.textContent = venueObj.detailLabel;
        
        if (venueObj.detailType === 'text') {
            venueDetailInputArea.innerHTML = `<input type="text" id="venueDetails" class="form-control" placeholder="${venueObj.detailPlaceholder}" required>`;
        } else if (venueObj.detailType === 'select') {
            let html = `<select id="venueDetails" class="form-select" required><option value="" disabled selected>Select Option</option>`;
            venueObj.options.forEach(opt => {
                html += `<option value="${opt}">${opt}</option>`;
            });
            html += `</select>`;
            venueDetailInputArea.innerHTML = html;
        }
    }
}

function onTurnstileSuccess(token) {
    currentTurnstileToken = token;
    btnSubmit.disabled = false;
}

function onTurnstileExpired() {
    currentTurnstileToken = null;
    // Only disable if Turnstile is actually configured
    if (TURNSTILE_SITE_KEY && TURNSTILE_SITE_KEY !== 'YOUR_TURNSTILE_SITE_KEY') {
        btnSubmit.disabled = true;
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    formErrorMsg.classList.add('d-none');
    
    const start = startTimeInput.value;
    const end = endTimeInput.value;
    
    if (start >= end) {
        showError('End time must be after start time.');
        return;
    }

    const clubName = clubSelect.value;
    const eventName = document.getElementById('eventName').value.trim();
    const date = eventDateInput.value;
    const audience = document.querySelector('input[name="audience"]:checked').value;
    const venue = venueSelect.value;
    
    let venueDetails = '';
    const detailsInput = document.getElementById('venueDetails');
    if (detailsInput) {
        venueDetails = detailsInput.value.trim();
        if (!venueDetails) {
            showError('Please provide venue details.');
            return;
        }
    }

    currentEventData = {
        clubName,
        eventName,
        date,
        startTime: start,
        endTime: end,
        audience,
        venue,
        venueDetails,
        turnstileToken: currentTurnstileToken
    };

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Checking...';

    try {
        const clashes = await checkForClashes(date, start, end, venue, venueDetails);
        if (clashes.length > 0) {
            showClashView(clashes);
        } else {
            await submitEvent(false);
        }
    } catch (err) {
        console.error(err);
        showError('Error checking for clashes. Please try again.');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="bi bi-check-circle me-2"></i> Check & Submit Event';
    }
}

async function checkForClashes(date, start, end, venue, venueDetails) {
    const snapshot = await db.collection('events').where('date', '==', date).get();
    const clashes = [];
    
    snapshot.forEach(doc => {
        const ev = doc.data();
        
        let isSameVenue = false;
        if (ev.venue === venue) {
            if (venue === 'Prefabs' || venue === 'Auditorium') {
                if (ev.venueDetails && ev.venueDetails.toLowerCase() === venueDetails.toLowerCase()) {
                    isSameVenue = true;
                }
            } else {
                isSameVenue = true;
            }
        }
        
        if (isSameVenue && timesOverlap(start, end, ev.startTime, ev.endTime)) {
            clashes.push(ev);
        }
    });
    
    return clashes;
}

function showClashView(clashes) {
    const clashList = document.getElementById('clash-list');
    clashList.innerHTML = '';
    
    clashes.forEach(c => {
        const div = document.createElement('div');
        div.className = 'clash-event card mb-2 border-warning';
        div.innerHTML = `
            <div class="card-body py-2">
                <strong>${c.eventName}</strong> by ${c.clubName}<br>
                <small class="text-muted"><i class="bi bi-clock"></i> ${formatTime(c.startTime)} - ${formatTime(c.endTime)}</small>
            </div>
        `;
        clashList.appendChild(div);
    });
    
    formView.classList.add('d-none');
    clashView.classList.remove('d-none');
}

function showFormView() {
    formView.classList.remove('d-none');
    clashView.classList.add('d-none');
    successView.classList.add('d-none');
}

async function submitEvent(clashAcknowledged) {
    const btn = document.getElementById(clashAcknowledged ? 'btn-submit-anyway' : 'btn-submit');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Submitting...';
    
    try {
        const user = getCurrentUser();
        const editToken = generateUUID();
        
        const docData = {
            ...currentEventData,
            editToken,
            createdBy: user.uid,
            createdByEmail: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            clashAcknowledged
        };
        
        delete docData.turnstileToken; // Don't save token to DB
        
        await db.collection('events').add(docData);
        
        showSuccessView(editToken);
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Failed to submit event. " + error.message);
        showFormView();
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}

function showSuccessView(editToken) {
    formView.classList.add('d-none');
    clashView.classList.add('d-none');
    successView.classList.remove('d-none');
    
    const editLink = window.location.origin + window.location.pathname.replace('submit.html', '') + 'edit.html?token=' + editToken;
    document.getElementById('edit-link-input').value = editLink;
}

function resetForm() {
    eventForm.reset();
    venueDetailContainer.classList.add('d-none');
    venueDetailInputArea.innerHTML = '';
    
    if (typeof turnstile !== 'undefined') {
        turnstile.reset();
    }
    currentTurnstileToken = null;
    btnSubmit.disabled = true;
    
    const user = getCurrentUser();
    if(user) {
        onAuthReady(user, getCurrentUserData());
    }
    
    showFormView();
}

function copyLink() {
    const input = document.getElementById('edit-link-input');
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);
    
    const btn = document.getElementById('btn-copy-link');
    btn.innerHTML = '<i class="bi bi-check2"></i> Copied!';
    setTimeout(() => {
        btn.innerHTML = '<i class="bi bi-clipboard"></i> Copy Link';
    }, 2000);
}

function showError(msg) {
    formErrorMsg.textContent = msg;
    formErrorMsg.classList.remove('d-none');
}
