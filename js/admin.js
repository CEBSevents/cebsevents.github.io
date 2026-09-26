let usersUnsubscribe = null;
let eventsUnsubscribe = null;
let confirmActionCallback = null;
let confirmModal = null;
let addUserModal = null;

document.addEventListener('DOMContentLoaded', () => {
    confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    addUserModal = new bootstrap.Modal(document.getElementById('addUserModal'));

    // Populate clubs in add user modal
    const userClubSelect = document.getElementById('userClub');
    if (userClubSelect && typeof CLUBS !== 'undefined') {
        CLUBS.forEach(club => {
            const option = document.createElement('option');
            option.value = club.name;
            option.textContent = club.name;
            userClubSelect.appendChild(option);
        });
        const adminOption = document.createElement('option');
        adminOption.value = "Admin";
        adminOption.textContent = "Admin";
        userClubSelect.appendChild(adminOption);
    }
    
    if (typeof ALLOWED_EMAIL_DOMAIN !== 'undefined') {
        document.getElementById('userEmail').placeholder = `user@${ALLOWED_EMAIL_DOMAIN}`;
    }

    // Role toggle logic
    document.getElementById('userRole').addEventListener('change', function() {
        const clubSelect = document.getElementById('userClub');
        if (this.value === 'admin') {
            clubSelect.value = 'Admin';
        } else {
            if (clubSelect.value === 'Admin') {
                clubSelect.value = '';
            }
        }
    });

    // Add user form submit
    document.getElementById('add-user-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('btn-save-user');
        const alertBox = document.getElementById('add-user-alert');
        
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
        alertBox.classList.add('d-none');
        
        const name = document.getElementById('userName').value.trim();
        const email = document.getElementById('userEmail').value.trim().toLowerCase();
        const role = document.getElementById('userRole').value;
        const clubName = document.getElementById('userClub').value;
        
        try {
            await db.collection('authorizedUsers').doc(email).set({
                name,
                email,
                role,
                clubName
            });
            
            addUserModal.hide();
            document.getElementById('add-user-form').reset();
        } catch (error) {
            console.error("Error adding user:", error);
            alertBox.textContent = "Error saving user: " + error.message;
            alertBox.className = "alert d-block alert-danger";
        } finally {
            btn.disabled = false;
            btn.textContent = "Save User";
        }
    });

    // Confirm modal action
    document.getElementById('btn-confirm-action').addEventListener('click', () => {
        if (confirmActionCallback) {
            confirmActionCallback();
        }
        confirmModal.hide();
    });
    
    // Initialize Auth
    initAuth({
        requireAuth: true,
        requireAdmin: true,
        onReady: onAdminReady
    });
});

function onAdminReady(user, userData) {
    loadUsers();
    loadEvents();
}

function loadUsers() {
    if (usersUnsubscribe) usersUnsubscribe();
    
    usersUnsubscribe = db.collection('authorizedUsers').onSnapshot(snapshot => {
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = '';
        
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">No authorized users found.</td></tr>';
            return;
        }
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            let clubBadge = '';
            if (data.role === 'admin') {
                clubBadge = `<span class="badge bg-dark">Admin</span>`;
            } else {
                const color = typeof getClubColor === 'function' ? getClubColor(data.clubName) : '#6c757d';
                const textColor = typeof getClubTextColor === 'function' ? getClubTextColor(data.clubName) : '#fff';
                clubBadge = `<span class="badge" style="background-color: ${color}; color: ${textColor}">${data.clubName}</span>`;
            }
            
            const roleBadge = data.role === 'admin' 
                ? `<span class="badge bg-danger"><i class="bi bi-shield-lock"></i> Admin</span>` 
                : `<span class="badge bg-info text-dark"><i class="bi bi-person-badge"></i> In-charge</span>`;
                
            tr.innerHTML = `
                <td class="fw-bold">${data.name || 'N/A'}</td>
                <td>${data.email}</td>
                <td>${clubBadge}</td>
                <td>${roleBadge}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-outline-danger btn-remove-user" data-email="${data.email}" title="Remove User">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        document.querySelectorAll('.btn-remove-user').forEach(btn => {
            btn.addEventListener('click', function() {
                const email = this.getAttribute('data-email');
                if(getCurrentUser() && email === getCurrentUser().email) {
                    alert("You cannot remove yourself!");
                    return;
                }
                showConfirm("Remove User", `Are you sure you want to remove access for <b>${email}</b>?`, () => {
                    db.collection('authorizedUsers').doc(email).delete()
                        .then(() => console.log("User removed"))
                        .catch(err => alert("Error removing user: " + err.message));
                });
            });
        });
    }, error => {
        console.error("Error loading users:", error);
        document.getElementById('users-tbody').innerHTML = `<tr><td colspan="5" class="text-center text-danger">Error loading users: ${error.message}</td></tr>`;
    });
}

function loadEvents() {
    if (eventsUnsubscribe) eventsUnsubscribe();
    
    eventsUnsubscribe = db.collection('events').orderBy('date', 'desc').onSnapshot(snapshot => {
        const tbody = document.getElementById('events-tbody');
        tbody.innerHTML = '';
        
        if (snapshot.empty) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No events found.</td></tr>';
            return;
        }
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const tr = document.createElement('tr');
            
            const color = typeof getClubColor === 'function' ? getClubColor(data.clubName) : '#6c757d';
            const textColor = typeof getClubTextColor === 'function' ? getClubTextColor(data.clubName) : '#fff';
            const clubBadge = `<span class="badge" style="background-color: ${color}; color: ${textColor}">${data.clubName}</span>`;
            
            const venueDisplay = typeof getVenueDisplay === 'function' ? getVenueDisplay(data.venue, data.venueDetails) : data.venue;
            const dateDisplay = typeof formatDate === 'function' ? formatDate(data.date) : data.date;
            const timeDisplay = typeof formatTime === 'function' ? `${formatTime(data.startTime)} - ${formatTime(data.endTime)}` : `${data.startTime} - ${data.endTime}`;
            
            tr.innerHTML = `
                <td>
                    <div class="fw-bold">${dateDisplay}</div>
                    <div class="small text-muted">${timeDisplay}</div>
                </td>
                <td class="fw-bold">${data.eventName}</td>
                <td>${clubBadge}</td>
                <td>${venueDisplay}</td>
                <td>${data.audience}</td>
                <td class="text-end text-nowrap">
                    <a href="edit.html?token=${data.editToken}" class="btn btn-sm btn-outline-primary me-1" title="Edit Event">
                        <i class="bi bi-pencil"></i> Edit
                    </a>
                    <button class="btn btn-sm btn-outline-danger btn-delete-event" data-id="${doc.id}" data-name="${data.eventName}" title="Delete Event">
                        <i class="bi bi-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        
        document.querySelectorAll('.btn-delete-event').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const name = this.getAttribute('data-name');
                showConfirm("Delete Event", `Are you sure you want to delete the event <b>${name}</b>?`, () => {
                    db.collection('events').doc(id).delete()
                        .then(() => console.log("Event deleted"))
                        .catch(err => alert("Error deleting event: " + err.message));
                });
            });
        });
    }, error => {
        console.error("Error loading events:", error);
        document.getElementById('events-tbody').innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading events: ${error.message}</td></tr>`;
    });
}

function showConfirm(title, message, callback) {
    document.getElementById('confirmModalTitle').textContent = title;
    document.getElementById('confirmModalBody').innerHTML = message;
    confirmActionCallback = callback;
    confirmModal.show();
}
