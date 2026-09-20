function renderSignupPage() {
  return `
                <div class="container py-5" style="max-width: 420px;">
                    <div class="bg-white p-4 rounded-4 border shadow-sm text-center">
                        <span class="font-whimsy fs-2" style="color: var(--sage);">Join Our Journal</span>
                        <h2 class="font-serif fw-bold h4 mb-4">Create Account</h2>
                        <form onsubmit="handleSignupSubmit(event)" id="signupForm">
                            <div class="mb-3 text-start">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Full Name</label>
                                <input type="text" required id="name" placeholder="Flora Meadow" class="form-control">
                            </div>
                            <div class="mb-3 text-start">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Email Address</label>
                                <input type="email" required id="email" placeholder="user@whimsy.com" class="form-control">
                            </div>
                            <div class="mb-3 text-start">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Password</label>
                                <input type="password" required id="password" placeholder="••••••••" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-primary w-100 mt-2" id="signupbtn">Create Account</button>
                        </form>
                        <p class="small text-secondary mt-3 mb-0">Already have an account? <button onclick="navigateTo('login')" class="btn btn-link p-0 text-success fw-bold text-decoration-none small">Log In</button></p>
                    </div>
                </div>
            `;
}


function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  appState.currentUser = { name, email };
  saveUserToStorage();
  showToast(`Account created! Welcome, ${name}.`);
  navigateTo("home");
}

