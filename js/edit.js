let currentEventId = null;
let currentEventData = null;
let clashModal = null;
let deleteModal = null;

document.addEventListener('DOMContentLoaded', async () => {
    clashModal = new bootstrap.Modal(document.getElementById('clashModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    // Init auth (navbar only)
    initAuth({});

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showError("No edit token provided.");
        return;
    }

    try {
        const snapshot = await db.collection('events').where('editToken', '==', token).get();
        if (snapshot.empty) {
            showError("Invalid or expired edit link.");
            return;
        }

        const doc = snapshot.docs[0];
        currentEventId = doc.id;
        currentEventData = doc.data();

        setupForm();
        populateForm(currentEventData);
        
        document.getElementById('form-container').classList.remove('d-none');
    } catch (error) {
        console.error("Error fetching event:", error);
        showError("Error loading event data.");
    }

    // Form submission
    document.getElementById('edit-event-form').addEventListener('submit', handleFormSubmit);
    
    // Force save from clash modal
    document.getElementById('btn-force-save').addEventListener('click', () => {
        clashModal.hide();
        saveEvent(true);
    });

    // Delete flow
    document.getElementById('btn-delete-event').addEventListener('click', () => {
        deleteModal.show();
    });

    document.getElementById('btn-confirm-delete').addEventListener('click', deleteEvent);
});

function showError(msg) {
    document.getElementById('error-message').textContent = msg;
    document.getElementById('error-container').classList.remove('d-none');
    document.getElementById('form-container').classList.add('d-none');
}

function showSuccess(msg) {
    document.getElementById('success-message').textContent = msg;
    document.getElementById('success-container').classList.remove('d-none');
    document.getElementById('form-container').classList.add('d-none');
}

function setupForm() {
    // Populate clubs
    const clubSelect = document.getElementById('clubName');
    if (typeof CLUBS !== 'undefined') {
        CLUBS.forEach(club => {
            const option = document.createElement('option');
            option.value = club.name;
            option.textContent = club.name;
            clubSelect.appendChild(option);
        });
    }

    // Populate venues
    const venueSelect = document.getElementById('venue');
    if (typeof VENUES !== 'undefined') {
        VENUES.forEach(v => {
            const option = document.createElement('option');
            option.value = v.value;
            option.textContent = v.label;
            venueSelect.appendChild(option);
        });
    }

    venueSelect.addEventListener('change', handleVenueChange);
}

function handleVenueChange() {
    const venueVal = document.getElementById('venue').value;
    const venueConfig = typeof VENUES !== 'undefined' ? VENUES.find(v => v.value === venueVal) : null;
    
    const container = document.getElementById('venue-details-container');
    const inputContainer = document.getElementById('venue-details-input-container');
    const label = document.getElementById('venue-details-label');
    
    inputContainer.innerHTML = '';
    
    if (venueConfig && venueConfig.needsDetail) {
        container.classList.remove('d-none');
        label.textContent = venueConfig.detailLabel;
        
        if (venueConfig.detailType === 'select' && venueConfig.options) {
            const select = document.createElement('select');
            select.className = 'form-select';
            select.id = 'venueDetails';
            select.required = true;
            
            const defaultOpt = document.createElement('option');
            defaultOpt.value = "";
            defaultOpt.disabled = true;
            defaultOpt.selected = true;
            defaultOpt.textContent = venueConfig.detailPlaceholder || "Select...";
            select.appendChild(defaultOpt);
            
            venueConfig.options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                select.appendChild(option);
            });
            inputContainer.appendChild(select);
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'form-control';
            input.id = 'venueDetails';
            input.required = true;
            input.placeholder = venueConfig.detailPlaceholder || "";
            inputContainer.appendChild(input);
        }
    } else {
        container.classList.add('d-none');
    }
}

function populateForm(data) {
    document.getElementById('clubName').value = data.clubName;
    document.getElementById('eventName').value = data.eventName;
    
    if (data.eventDescription) {
        const descInput = document.getElementById('eventDescription');
        if (descInput) descInput.value = data.eventDescription;
    }
    if (data.posterUrl) {
        const posterInput = document.getElementById('posterUrl');
        if (posterInput) posterInput.value = data.posterUrl;
    }
    
    if (data.audience === 'everyone') {
        document.getElementById('audience-everyone').checked = true;
    } else {
        document.getElementById('audience-members').checked = true;
    }
    
    document.getElementById('eventDate').value = data.date;
    document.getElementById('startTime').value = data.startTime;
    document.getElementById('endTime').value = data.endTime;
    
    document.getElementById('venue').value = data.venue;
    handleVenueChange();
    
    if (data.venueDetails) {
        const detailsInput = document.getElementById('venueDetails');
        if (detailsInput) {
            detailsInput.value = data.venueDetails;
        }
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    if (startTime >= endTime) {
        alert("End time must be after start time.");
        return;
    }

    const date = document.getElementById('eventDate').value;
    const venue = document.getElementById('venue').value;

    const btn = document.getElementById('btn-save-event');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Checking...';

    try {
        // Clash detection
        const snapshot = await db.collection('events')
            .where('date', '==', date)
            .where('venue', '==', venue)
            .get();
            
        const clashes = [];
        snapshot.forEach(doc => {
            if (doc.id === currentEventId) return; // Skip self
            
            const ev = doc.data();
            if (typeof timesOverlap === 'function' && timesOverlap(startTime, endTime, ev.startTime, ev.endTime)) {
                clashes.push(ev);
            }
        });
        
        if (clashes.length > 0) {
            // Show modal
            const venueConfig = typeof VENUES !== 'undefined' ? VENUES.find(v => v.value === venue) : null;
            document.getElementById('clash-venue-name').textContent = venueConfig ? venueConfig.label : venue;
            
            const list = document.getElementById('clash-list');
            list.innerHTML = '';
            clashes.forEach(c => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `<strong>${c.eventName}</strong> (${c.clubName})<br><small>${typeof formatTime === 'function' ? formatTime(c.startTime) : c.startTime} - ${typeof formatTime === 'function' ? formatTime(c.endTime) : c.endTime}</small>`;
                list.appendChild(li);
            });
            
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-save"></i> Save Changes';
            clashModal.show();
        } else {
            await saveEvent(false);
        }
    } catch (error) {
        console.error("Error during pre-save check:", error);
        alert("Error verifying event: " + error.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-save"></i> Save Changes';
    }
}

async function saveEvent(clashAcknowledged) {
    const btn = document.getElementById('btn-save-event');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

    try {
        const detailsInput = document.getElementById('venueDetails');
        
        const updates = {
            eventName: document.getElementById('eventName').value.trim(),
            eventDescription: document.getElementById('eventDescription') ? document.getElementById('eventDescription').value.trim() : null,
            posterUrl: document.getElementById('posterUrl') ? document.getElementById('posterUrl').value.trim() : null,
            audience: document.querySelector('input[name="audience"]:checked').value,
            date: document.getElementById('eventDate').value,
            startTime: document.getElementById('startTime').value,
            endTime: document.getElementById('endTime').value,
            venue: document.getElementById('venue').value,
            venueDetails: detailsInput ? detailsInput.value.trim() : null,
            clashAcknowledged: clashAcknowledged || currentEventData.clashAcknowledged || false
        };

        await db.collection('events').doc(currentEventId).update(updates);
        showSuccess("Event updated successfully!");
    } catch (error) {
        console.error("Error updating event:", error);
        alert("Error saving event: " + error.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-save"></i> Save Changes';
    }
}

async function deleteEvent() {
    const btn = document.getElementById('btn-confirm-delete');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Deleting...';
    
    try {
        await db.collection('events').doc(currentEventId).delete();
        deleteModal.hide();
        showSuccess("Event deleted successfully.");
    } catch (error) {
        console.error("Error deleting event:", error);
        alert("Error deleting event: " + error.message);
        btn.disabled = false;
        btn.innerHTML = 'Delete';
        deleteModal.hide();
    }
}
