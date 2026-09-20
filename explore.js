function renderExplorePage() {
    const cuisines = ['Italian', 'Pakistani', 'French', 'Middle Eastern', 'Asian', 'Mexican'];
    const activeCuisine = appState.selectedCuisineFilter;
    const filtered = activeCuisine === 'All' ? appState.recipes : appState.recipes.filter(r => r.cuisine.toLowerCase() === activeCuisine.toLowerCase());

    return `
                <div class="container py-4">
                    <div class="text-center mb-4">
                        <span class="font-whimsy fs-2" style="color: var(--sage);">Flavors of the World</span>
                        <h1 class="font-serif fw-bold h2 mb-0">Explore by Cuisine</h1>
                    </div>

                    <div class="d-flex justify-content-center gap-2 flex-wrap mb-4">
                        <button onclick="filterByCuisine('All')" class="chip-btn ${activeCuisine === 'All' ? 'active' : ''}">All Cuisines</button>
                        ${cuisines.map(c => `
                            <button onclick="filterByCuisine('${c}')" class="chip-btn ${activeCuisine === c ? 'active' : ''}">${c}</button>
                        `).join('')}
                    </div>

                    <div class="row g-4">
                        ${filtered.length > 0 ? filtered.map(recipe => `
                            <div class="col-12 col-md-6 col-lg-4">
                                ${renderRecipeCard(recipe)}
                            </div>
                        `).join('') : `
                            <div class="col-12 text-center py-5 bg-white rounded-4 border">
                                <p class="text-secondary mb-0">No recipes found in this cuisine category.</p>
                            </div>
                        `}
                    </div>
                </div>
            `;
}

// Core App Render Dispatcher
function renderApp() {
    renderNavbarAuth();
    const container = document.getElementById('app-content');

    switch (appState.currentView) {
        case 'home': container.innerHTML = renderHomePage(); break;
        case 'single-recipe': container.innerHTML = renderSingleRecipePage(); break;
        case 'login': container.innerHTML = renderLoginPage(); break;
        case 'signup': container.innerHTML = renderSignupPage(); break;
        case 'create': container.innerHTML = renderCreateEditPostPage(false); break;
        case 'edit': container.innerHTML = renderCreateEditPostPage(true); break;
        case 'dashboard': container.innerHTML = renderDashboardPage(); break;
        case 'explore': container.innerHTML = renderExplorePage(); break;
        default: container.innerHTML = renderHomePage();
    }
}

// Application Initialization Event
window.onload = function () {
    initStorage();
    renderApp();
};