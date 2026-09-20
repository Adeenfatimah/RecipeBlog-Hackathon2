function renderLoginPage() {
  return `
                <div class="container py-5" style="max-width: 420px;">
                    <div class="bg-white p-4 rounded-4 border shadow-sm text-center">
                        <span class="font-whimsy fs-2" style="color: var(--sage);">Welcome Back</span>
                        <h2 class="font-serif fw-bold h4 mb-4">Log In to Whimsy</h2>
                        <form onsubmit="handleLoginSubmit(event)" id="loginForm">
                            <div class="mb-3 text-start">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Email Address</label>
                                <input type="email" required id="email" placeholder="user@whimsy.com" class="form-control">
                            </div>
                            <div class="mb-3 text-start">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Password</label>
                                <input type="password" required id="password" placeholder="••••••••" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mt-2" id="loginbtn">Log In</button>
                        </form>
                        <p class="small text-secondary mt-3 mb-0">Don't have an account? <button onclick="navigateTo('signup')" class="btn btn-link p-0 text-success fw-bold text-decoration-none small">Sign Up</button></p>
                    </div>
                </div>
            `;
}
function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const name = email.split('@')[0];
    appState.currentUser = { name: name.charAt(0).toUpperCase() + name.slice(1), email };
    saveUserToStorage();
    showToast(`Welcome back, ${appState.currentUser.name}!`);
    navigateTo('home');
}

