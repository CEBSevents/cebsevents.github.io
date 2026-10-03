// ============================================================
// CEBS Event Calendar — public board (calendar + list views)
// ============================================================

let allEvents = [];
let activeFilters = new Set();
let calendar;
let eventModal;

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ---------- helpers ----------

function escapeHtml(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function parseLocalDate(dateStr) {
    const [y, m, d] = String(dateStr).split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
}

function eventStart(ev) { return new Date(`${ev.date}T${ev.startTime || '00:00'}`); }
function eventEnd(ev)   { return new Date(`${ev.date}T${ev.endTime || ev.startTime || '23:59'}`); }
function byStart(a, b)  { return eventStart(a) - eventStart(b); }

function relativeDayLabel(dateStr) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((parseLocalDate(dateStr) - today) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    if (diff > 1 && diff < 7) return `In ${diff} days`;
    return null;
}

// ---------- boot ----------

document.addEventListener('DOMContentLoaded', () => {
    initAuth({});

    eventModal = new bootstrap.Modal(document.getElementById('eventModal'));

    initFilters();

    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: window.innerWidth < 768 ? 'listMonth' : 'dayGridMonth',
        locale: 'en-gb',
        firstDay: 1,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,listMonth'
        },
        buttonText: { today: 'Today', month: 'Month', week: 'Week', list: 'Agenda' },
        height: 'auto',
        eventDisplay: 'block',
        dayMaxEvents: 3,
        eventTimeFormat: { hour: 'numeric', minute: '2-digit', hour12: true },
        noEventsContent: 'Nothing on the board for this stretch.',
        eventClick: function (info) {
            showEventDetails(info.event.extendedProps);
        }
    });
    calendar.render();

    setupViewToggles();

    db.collection('events').onSnapshot(snapshot => {
        allEvents = [];
        snapshot.forEach(doc => {
            allEvents.push({ id: doc.id, ...doc.data() });
        });
        updateViews();
    }, error => {
        console.error('Error fetching events: ', error);
        renderNextUp(null, true);
    });
});

// ---------- filters ----------

function makeChip(label, color, isClub) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'filter-chip active ' + (isClub ? 'club-chip' : 'all-chip');
    chip.style.setProperty('--club', color);
    chip.setAttribute('aria-pressed', 'true');
    chip.innerHTML = '<span class="sw" aria-hidden="true"></span>' + escapeHtml(label);
    return chip;
}

function setChipState(chip, on) {
    chip.classList.toggle('active', on);
    chip.setAttribute('aria-pressed', on ? 'true' : 'false');
}

function initFilters() {
    const filterBar = document.getElementById('filter-bar');

    const allChip = makeChip('All clubs', '#1E1B3A', false);
    allChip.addEventListener('click', () => {
        const turnOn = !allChip.classList.contains('active');
        activeFilters.clear();
        if (turnOn) CLUBS.forEach(c => activeFilters.add(c.name));
        setChipState(allChip, turnOn);
        filterBar.querySelectorAll('.club-chip').forEach(c => setChipState(c, turnOn));
        updateViews();
    });
    filterBar.appendChild(allChip);

    CLUBS.forEach(club => {
        activeFilters.add(club.name); // all on by default
        const chip = makeChip(club.name, club.color, true);
        chip.addEventListener('click', () => {
            const turnOn = !chip.classList.contains('active');
            setChipState(chip, turnOn);
            if (turnOn) activeFilters.add(club.name);
            else activeFilters.delete(club.name);
            setChipState(allChip, activeFilters.size === CLUBS.length);
            updateViews();
        });
        filterBar.appendChild(chip);
    });
}

// ---------- view toggle ----------

function setupViewToggles() {
    const btnCal = document.getElementById('btn-calendar-view');
    const btnList = document.getElementById('btn-list-view');
    const calView = document.getElementById('calendar-view');
    const listView = document.getElementById('list-view');

    function show(view) {
        const isCal = view === 'calendar';
        btnCal.classList.toggle('is-active', isCal);
        btnCal.setAttribute('aria-pressed', String(isCal));
        btnList.classList.toggle('is-active', !isCal);
        btnList.setAttribute('aria-pressed', String(!isCal));
        calView.classList.toggle('d-none', !isCal);
        listView.classList.toggle('d-none', isCal);
        if (isCal) calendar.updateSize();
    }

    btnCal.addEventListener('click', () => show('calendar'));
    btnList.addEventListener('click', () => show('list'));
}

// ---------- render ----------

function updateViews() {
    const filtered = allEvents.filter(ev => activeFilters.has(ev.clubName));

    calendar.removeAllEventSources();
    calendar.addEventSource(filtered.map(ev => ({
        id: ev.id,
        title: ev.eventName,
        start: `${ev.date}T${ev.startTime}`,
        end: `${ev.date}T${ev.endTime}`,
        backgroundColor: getClubColor(ev.clubName),
        borderColor: getClubColor(ev.clubName),
        textColor: getClubTextColor(ev.clubName),
        extendedProps: ev
    })));

    renderListView(filtered);
    renderNextUp(filtered);
}

function renderNextUp(events, failed) {
    const box = document.getElementById('next-up');
    if (!box) return;
    const body = box.querySelector('.next-up-body');

    if (failed) {
        body.innerHTML = '<p class="next-up-empty">Couldn\'t reach the board just now. Try refreshing in a bit.</p>';
        return;
    }

    const now = new Date();
    const upcoming = events.filter(ev => eventEnd(ev) >= now).sort(byStart);

    if (!upcoming.length) {
        body.innerHTML =
            '<p class="next-up-empty">Nothing pinned yet.<br>' +
            '<a href="submit.html">Club in-charge? Put the first event up &rarr;</a></p>';
        return;
    }

    const ev = upcoming[0];
    const d = parseLocalDate(ev.date);
    const rel = relativeDayLabel(ev.date);
    const live = eventStart(ev) <= now;
    const whenLead = live
        ? '<span class="live">Happening now</span> &middot; '
        : (rel ? `<strong>${rel}</strong> &middot; ` : '');

    body.innerHTML = `
        <div class="next-up-club" style="--club:${getClubColor(ev.clubName)}"><span class="sw"></span>${escapeHtml(ev.clubName)}</div>
        <h3 class="next-up-title">${escapeHtml(ev.eventName)}</h3>
        <dl class="next-up-meta">
            <div><dt>When</dt><dd>${whenLead}${DAYS_SHORT[d.getDay()]}, ${formatDate(ev.date)}<br>${formatTime(ev.startTime)} &ndash; ${formatTime(ev.endTime)}</dd></div>
            <div><dt>Where</dt><dd>${escapeHtml(getVenueDisplay(ev.venue, ev.venueDetails))}</dd></div>
        </dl>
        <button type="button" class="next-up-more">See details <i class="bi bi-arrow-right"></i></button>
        ${upcoming.length > 1 ? `<div class="next-up-after">+ ${upcoming.length - 1} more coming up</div>` : ''}
    `;
    body.querySelector('.next-up-more').addEventListener('click', () => showEventDetails(ev));
}

function ticketHtml(ev) {
    const d = parseLocalDate(ev.date);
    const open = ev.audience === 'everyone';
    return `
        <article class="ticket" style="--club:${getClubColor(ev.clubName)}" tabindex="0" role="button"
                 aria-label="${escapeHtml(ev.eventName)}, ${escapeHtml(ev.clubName)}, ${formatDate(ev.date)}">
            <div class="ticket-stub" aria-hidden="true">
                <span class="ticket-dow">${DAYS_SHORT[d.getDay()]}</span>
                <span class="ticket-day">${String(d.getDate()).padStart(2, '0')}</span>
                <span class="ticket-month">${MONTHS_SHORT[d.getMonth()]}</span>
            </div>
            <div class="ticket-body">
                <div class="ticket-club"><span class="sw"></span>${escapeHtml(ev.clubName)}</div>
                <h4 class="ticket-title">${escapeHtml(ev.eventName)}</h4>
                <div class="ticket-meta">
                    <span><i class="bi bi-clock"></i>${formatTime(ev.startTime)} &ndash; ${formatTime(ev.endTime)}</span>
                    <span><i class="bi bi-geo-alt"></i>${escapeHtml(getVenueDisplay(ev.venue, ev.venueDetails))}</span>
                </div>
                <span class="tag ${open ? 'tag-open' : 'tag-members'}">${open ? 'Open to all' : 'Members only'}</span>
            </div>
        </article>`;
}

function fillTickets(container, list, emptyMsg) {
    container.innerHTML = '';
    if (!list.length) {
        container.innerHTML = `<p class="empty-note">${emptyMsg}</p>`;
        return;
    }
    list.forEach(ev => {
        const wrap = document.createElement('div');
        wrap.innerHTML = ticketHtml(ev).trim();
        const ticket = wrap.firstElementChild;
        ticket.addEventListener('click', () => showEventDetails(ev));
        ticket.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showEventDetails(ev);
            }
        });
        container.appendChild(ticket);
    });
}

function renderListView(events) {
    const now = new Date();
    const sorted = [...events].sort(byStart);
    const upcoming = sorted.filter(ev => eventEnd(ev) >= now);
    const past = sorted.filter(ev => eventEnd(ev) < now).reverse(); // most recent first

    fillTickets(document.getElementById('upcoming-events'), upcoming,
        'Nothing coming up for the clubs you\'ve selected.');
    fillTickets(document.getElementById('past-events'), past,
        'No past events for the clubs you\'ve selected.');

    document.getElementById('upcoming-count').textContent =
        upcoming.length ? String(upcoming.length).padStart(2, '0') : '';
    document.getElementById('past-count').textContent = `(${past.length})`;
}

// ---------- modal ----------

function showEventDetails(ev) {
    document.getElementById('modalTitle').textContent = ev.eventName;

    const header = document.getElementById('modalHeader');
    header.style.backgroundColor = getClubColor(ev.clubName);
    header.style.color = getClubTextColor(ev.clubName);

    const d = parseLocalDate(ev.date);
    const rel = relativeDayLabel(ev.date);

    document.getElementById('modalClub').textContent = ev.clubName;
    document.getElementById('modalDate').textContent =
        `${DAYS_SHORT[d.getDay()]}, ${formatDate(ev.date)}` + (rel ? ` · ${rel}` : '');
    document.getElementById('modalTime').textContent =
        `${formatTime(ev.startTime)} – ${formatTime(ev.endTime)}`;
    document.getElementById('modalVenue').textContent = getVenueDisplay(ev.venue, ev.venueDetails);

    const aud = document.getElementById('modalAudience');
    const open = ev.audience === 'everyone';
    aud.textContent = open ? 'Open to all' : 'Club members only';
    aud.className = 'tag ' + (open ? 'tag-open' : 'tag-members');

    const descContainer = document.getElementById('modalDescriptionContainer');
    const descEl = document.getElementById('modalDescription');
    if (ev.eventDescription) {
        descEl.textContent = ev.eventDescription;
        descContainer.classList.remove('d-none');
    } else {
        descContainer.classList.add('d-none');
    }

    const posterEl = document.getElementById('modalPoster');
    if (ev.posterUrl) {
        posterEl.src = ev.posterUrl;
        posterEl.classList.remove('d-none');
    } else {
        posterEl.src = "";
        posterEl.classList.add('d-none');
    }

    eventModal.show();
}
