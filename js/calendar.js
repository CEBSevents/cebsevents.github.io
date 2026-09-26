let allEvents = [];
let activeFilters = new Set();
let calendar;
let eventModal;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Auth
    initAuth({});

    eventModal = new bootstrap.Modal(document.getElementById('eventModal'));

    // 2. Initialize Filters
    initFilters();

    // 3. Initialize Calendar
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
        },
        height: 'auto',
        eventClick: function(info) {
            showEventDetails(info.event.extendedProps);
        }
    });
    calendar.render();

    // 4. Set up View Toggles
    setupViewToggles();

    // 5. Listen to Firestore
    db.collection('events').onSnapshot(snapshot => {
        allEvents = [];
        snapshot.forEach(doc => {
            allEvents.push({ id: doc.id, ...doc.data() });
        });
        updateViews();
    }, error => {
        console.error("Error fetching events: ", error);
    });
});

function initFilters() {
    const filterBar = document.getElementById('filter-bar');
    
    // Add "All" chip
    const allChip = document.createElement('div');
    allChip.className = 'filter-chip active fw-medium';
    allChip.style.backgroundColor = '#6c757d'; // secondary gray
    allChip.style.color = '#fff';
    allChip.textContent = 'All Clubs';
    
    allChip.addEventListener('click', () => {
        const isActive = allChip.classList.contains('active');
        if (isActive) {
            // Deselect all
            allChip.classList.remove('active');
            activeFilters.clear();
            document.querySelectorAll('.club-chip').forEach(c => c.classList.remove('active'));
        } else {
            // Select all
            allChip.classList.add('active');
            CLUBS.forEach(c => activeFilters.add(c.name));
            document.querySelectorAll('.club-chip').forEach(c => c.classList.add('active'));
        }
        updateViews();
    });
    filterBar.appendChild(allChip);

    // Add individual club chips
    CLUBS.forEach(club => {
        activeFilters.add(club.name); // All active by default
        
        const chip = document.createElement('div');
        chip.className = 'filter-chip club-chip active fw-medium';
        chip.style.backgroundColor = club.color;
        chip.style.color = club.textColor;
        chip.textContent = club.name;
        
        chip.addEventListener('click', () => {
            if (chip.classList.contains('active')) {
                chip.classList.remove('active');
                activeFilters.delete(club.name);
                allChip.classList.remove('active');
            } else {
                chip.classList.add('active');
                activeFilters.add(club.name);
                // If all are selected, mark 'All' as active
                if (activeFilters.size === CLUBS.length) {
                    allChip.classList.add('active');
                }
            }
            updateViews();
        });
        
        filterBar.appendChild(chip);
    });
}

function setupViewToggles() {
    const btnCal = document.getElementById('btn-calendar-view');
    const btnList = document.getElementById('btn-list-view');
    const calView = document.getElementById('calendar-view');
    const listView = document.getElementById('list-view');

    btnCal.addEventListener('click', () => {
        btnCal.classList.replace('btn-outline-primary', 'btn-primary');
        btnCal.classList.remove('bg-white');
        
        btnList.classList.replace('btn-primary', 'btn-outline-primary');
        btnList.classList.add('bg-white');
        
        calView.classList.remove('d-none');
        listView.classList.add('d-none');
        
        calendar.render(); // Ensure calendar fits container properly when made visible
    });

    btnList.addEventListener('click', () => {
        btnList.classList.replace('btn-outline-primary', 'btn-primary');
        btnList.classList.remove('bg-white');
        
        btnCal.classList.replace('btn-primary', 'btn-outline-primary');
        btnCal.classList.add('bg-white');
        
        listView.classList.remove('d-none');
        calView.classList.add('d-none');
    });
}

function updateViews() {
    const filteredEvents = allEvents.filter(ev => activeFilters.has(ev.clubName));
    
    // Update Calendar View
    calendar.removeAllEventSources();
    const calEvents = filteredEvents.map(ev => ({
        id: ev.id,
        title: ev.eventName,
        start: `${ev.date}T${ev.startTime}`,
        end: `${ev.date}T${ev.endTime}`,
        backgroundColor: getClubColor(ev.clubName),
        borderColor: getClubColor(ev.clubName),
        textColor: getClubTextColor(ev.clubName),
        extendedProps: ev
    }));
    calendar.addEventSource(calEvents);
    
    // Update List View
    renderListView(filteredEvents);
}

function renderListView(events) {
    const upcomingContainer = document.getElementById('upcoming-events');
    const pastContainer = document.getElementById('past-events');
    
    upcomingContainer.innerHTML = '';
    pastContainer.innerHTML = '';
    
    const now = new Date();
    
    // Sort events by date and time ascending
    const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA - dateB;
    });
    
    sortedEvents.forEach(ev => {
        // Assume event is past if it ended
        const endDateTime = new Date(`${ev.date}T${ev.endTime || ev.startTime}`);
        const isPast = endDateTime < now;
        
        const col = document.createElement('div');
        col.className = 'col';
        
        const audienceBadge = ev.audience === 'everyone' 
            ? `<span class="badge bg-success bg-opacity-10 text-success border border-success"><i class="bi bi-globe"></i> Open to All</span>`
            : `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary"><i class="bi bi-people-fill"></i> Members Only</span>`;

        col.innerHTML = `
            <div class="card h-100 event-card shadow-sm border-0">
                <div class="card-body">
                    <span class="badge mb-3 px-3 py-2 rounded-pill shadow-sm" style="background-color: ${getClubColor(ev.clubName)}; color: ${getClubTextColor(ev.clubName)}">
                        ${ev.clubName}
                    </span>
                    <h5 class="card-title fw-bold mb-3">${ev.eventName}</h5>
                    <p class="card-text mb-2 text-muted">
                        <i class="bi bi-calendar-event me-2"></i> ${formatDate(ev.date)}
                    </p>
                    <p class="card-text mb-2 text-muted">
                        <i class="bi bi-clock me-2"></i> ${formatTime(ev.startTime)} - ${formatTime(ev.endTime)}
                    </p>
                    <p class="card-text mb-3 text-muted">
                        <i class="bi bi-geo-alt me-2"></i> ${getVenueDisplay(ev.venue, ev.venueDetails)}
                    </p>
                    ${audienceBadge}
                </div>
            </div>
        `;
        
        col.querySelector('.event-card').addEventListener('click', () => {
            showEventDetails(ev);
        });
        
        if (isPast) {
            pastContainer.appendChild(col);
        } else {
            upcomingContainer.appendChild(col);
        }
    });
    
    if (upcomingContainer.children.length === 0) {
        upcomingContainer.innerHTML = '<div class="col-12"><p class="text-muted fst-italic">No upcoming events match the selected filters.</p></div>';
    }
    if (pastContainer.children.length === 0) {
        pastContainer.innerHTML = '<div class="col-12"><p class="text-muted fst-italic">No past events match the selected filters.</p></div>';
    }
}

function showEventDetails(ev) {
    document.getElementById('modalTitle').textContent = ev.eventName;
    
    const header = document.getElementById('modalHeader');
    header.style.backgroundColor = getClubColor(ev.clubName);
    header.style.color = getClubTextColor(ev.clubName);
    
    // Close button color adjustment based on text color
    const closeBtn = header.querySelector('.btn-close');
    if (getClubTextColor(ev.clubName) === '#000000' || getClubTextColor(ev.clubName) === '#000') {
        closeBtn.classList.remove('btn-close-white');
    } else {
        closeBtn.classList.add('btn-close-white');
    }
    
    document.getElementById('modalClub').textContent = ev.clubName;
    document.getElementById('modalDate').textContent = formatDate(ev.date);
    document.getElementById('modalTime').textContent = `${formatTime(ev.startTime)} - ${formatTime(ev.endTime)}`;
    document.getElementById('modalVenue').textContent = getVenueDisplay(ev.venue, ev.venueDetails);
    
    const audienceEl = document.getElementById('modalAudience');
    if (ev.audience === 'everyone') {
        audienceEl.textContent = 'Open to All';
        audienceEl.className = 'fw-medium badge bg-success';
    } else {
        audienceEl.textContent = 'Members Only';
        audienceEl.className = 'fw-medium badge bg-primary';
    }
    
    eventModal.show();
}
