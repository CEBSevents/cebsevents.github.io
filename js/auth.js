// ============================================================
// Authentication Module
// Handles Firebase passwordless email-link authentication
// ============================================================
(function () {
    'use strict';

    // Action code settings for email link sign-in
    const actionCodeSettings = {
        // URL to redirect back to after the user clicks the email link.
        // TODO: Update this to your deployed domain (e.g. https://cebscalendar.in/login.html)
        url: window.location.origin + '/login.html',
        handleCodeInApp: true
    };

    // Current user state
    let currentUser = null;
    let currentUserData = null; // from authorizedUsers collection

    // ============================================================
    // Auth State Management
    // ============================================================

    /**
     * Initialize auth listener. Call this on every page load.
     *
     * @param {Object} options
     * @param {boolean} options.requireAuth  — redirect to login if not signed in
     * @param {boolean} options.requireAdmin — block page unless user is admin
     * @param {Function} options.onReady(user, userData) — called once auth state is resolved
     */
    function initAuth(options) {
        options = options || {};
        var requireAuth = options.requireAuth || false;
        var requireAdmin = options.requireAdmin || false;
        var onReady = options.onReady || null;

        auth.onAuthStateChanged(async function (user) {
            currentUser = user;

            if (user) {
                // Fetch authorization data from Firestore
                try {
                    var doc = await db.collection('authorizedUsers').doc(user.email).get();
                    currentUserData = doc.exists ? doc.data() : null;
                } catch (e) {
                    console.error('Error fetching user data:', e);
                    currentUserData = null;
                }
            } else {
                currentUserData = null;
            }

            updateNavbar();

            // --- Access control gates ---
            if (requireAuth && !user) {
                window.location.href = 'login.html';
                return;
            }

            if (requireAuth && user && !currentUserData) {
                showAccessDenied(
                    'Your email (' + user.email + ') is not authorized to submit events.',
                    'Contact the admin to get your account added.'
                );
                return;
            }

            if (requireAdmin && (!currentUserData || currentUserData.role !== 'admin')) {
                showAccessDenied(
                    'Access denied.',
                    'Admin privileges are required to view this page.'
                );
                return;
            }

            if (onReady) {
                onReady(user, currentUserData);
            }
        });
    }

    function showAccessDenied(title, message) {
        var main = document.querySelector('main') || document.querySelector('.page-content') || document.body;
        main.innerHTML =
            '<div class="container mt-5">' +
            '  <div class="alert alert-danger">' +
            '    <h5><i class="bi bi-shield-exclamation"></i> ' + title + '</h5>' +
            '    <p class="mb-0">' + message + '</p>' +
            '  </div>' +
            '  <a href="index.html" class="btn btn-primary"><i class="bi bi-arrow-left"></i> Go to Calendar</a>' +
            '</div>';
    }

    // ============================================================
    // Login / Logout
    // ============================================================

    /**
     * Send a passwordless login link to the given email.
     * Throws if the email domain is not allowed.
     */
    async function sendLoginLink(email) {
        email = email.trim().toLowerCase();

        if (!email.endsWith('@' + ALLOWED_EMAIL_DOMAIN)) {
            throw new Error('Only @' + ALLOWED_EMAIL_DOMAIN + ' email addresses are allowed.');
        }

        await auth.sendSignInLinkToEmail(email, actionCodeSettings);
        window.localStorage.setItem('emailForSignIn', email);
    }

    /**
     * Complete the sign-in if the current URL is a sign-in email link.
     * Returns the signed-in user or false.
     */
    async function completeSignIn() {
        if (!auth.isSignInWithEmailLink(window.location.href)) {
            return false;
        }

        var email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
            email = window.prompt('Please confirm your email address:');
        }
        if (!email) return false;

        var result = await auth.signInWithEmailLink(email, window.location.href);
        window.localStorage.removeItem('emailForSignIn');

        // Clean the URL to remove the sign-in query parameters
        window.history.replaceState(null, '', window.location.pathname);

        return result.user;
    }

    /**
     * Sign out and redirect to the calendar.
     */
    function logout() {
        auth.signOut().then(function () {
            window.location.href = 'index.html';
        });
    }

    // ============================================================
    // Navbar Update
    // ============================================================

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function updateNavbar() {
        var authNav = document.getElementById('auth-nav');
        if (!authNav) return;

        if (currentUser && currentUserData) {
            var adminBtn = '';
            if (currentUserData.role === 'admin') {
                adminBtn = '<a href="admin.html" class="btn btn-ink-outline btn-sm"><i class="bi bi-sliders"></i> Admin</a>';
            }
            authNav.innerHTML =
                '<div class="auth-nav-inner">' +
                '  <span class="user-chip">' +
                '    <span>' + esc(currentUserData.name || currentUser.email) + '</span>' +
                '    <span class="club-swatch" style="background-color:' + getClubColor(currentUserData.clubName) + '">' + esc(currentUserData.clubName) + '</span>' +
                '  </span>' +
                adminBtn +
                '  <button class="btn btn-ink-outline btn-sm" onclick="logout()">Log out</button>' +
                '</div>';
        } else if (currentUser) {
            authNav.innerHTML =
                '<div class="auth-nav-inner">' +
                '  <span class="small text-muted">' + esc(currentUser.email) + '</span>' +
                '  <button class="btn btn-ink-outline btn-sm" onclick="logout()">Log out</button>' +
                '</div>';
        } else {
            authNav.innerHTML =
                '<a href="login.html" class="btn btn-ink-outline btn-sm">' +
                '  Club login <i class="bi bi-arrow-right"></i>' +
                '</a>';
        }
    }

    // ============================================================
    // Getters
    // ============================================================

    function getCurrentUser() { return currentUser; }
    function getCurrentUserData() { return currentUserData; }
    function isLoggedIn() { return !!currentUser; }
    function isAdmin() { return !!(currentUserData && currentUserData.role === 'admin'); }
    function getUserClub() { return currentUserData ? currentUserData.clubName : null; }

    // ============================================================
    // Public API
    // ============================================================

    window.initAuth = initAuth;
    window.sendLoginLink = sendLoginLink;
    window.completeSignIn = completeSignIn;
    window.logout = logout;
    window.getCurrentUser = getCurrentUser;
    window.getCurrentUserData = getCurrentUserData;
    window.isLoggedIn = isLoggedIn;
    window.isAdmin = isAdmin;
    window.getUserClub = getUserClub;

})();
