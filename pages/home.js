// Home View Generator Function
        function renderHomePage() {
            const filteredRecipes = appState.recipes.filter(recipe => {
                const matchesSearch = recipe.title.toLowerCase().includes(appState.searchQuery.toLowerCase()) ||
                                      recipe.description.toLowerCase().includes(appState.searchQuery.toLowerCase());
                const matchesCategory = appState.selectedCategory === 'All' || recipe.category === appState.selectedCategory;
                let matchesFridge = true;
                if (appState.fridgeIngredients.length > 0) {
                    matchesFridge = recipe.ingredients.some(ing => 
                        appState.fridgeIngredients.some(fItem => ing.name.toLowerCase().includes(fItem.toLowerCase()))
                    );
                }
                return matchesSearch && matchesCategory && matchesFridge;
            });

            return `
                <div>
                    <!-- Hero Banner -->
                    <section class="py-5" style="background: linear-gradient(180deg, rgba(226, 213, 231, 0.3) 0%, var(--cream) 100%);">
                        <div class="container">
                            <div class="row align-items-center g-4">
                                <div class="col-lg-7">
                                    <span class="badge badge-sage mb-2">
                                        <i class="fa-solid fa-wand-magic-sparkles me-1 text-warning"></i> Organic Botanical Kitchen
                                    </span>
                                    <h1 class="display-4 fw-bold font-serif mb-3">
                                        A Little <span class="font-whimsy" style="color: var(--sage); font-size: 1.2em;">Whimsy,</span><br/>
                                        A Lot of Flavor.
                                    </h1>
                                    <p class="lead text-secondary mb-4" style="max-width: 500px;">
                                        Discover rustic botanical recipes, share magical kitchen stories, and cook wonderful creations today.
                                    </p>
                                    <div class="d-flex flex-wrap gap-2 mb-4">
                                        <button onclick="scrollToRecipes()" class="btn btn-primary">
                                            <i class="fa-solid fa-compass me-1"></i> Explore Recipes
                                        </button>
                                        <button onclick="navigateTo('create')" class="btn btn-outline">
                                            <i class="fa-solid fa-pen-nib me-1" style="color: var(--sage);"></i> Share Recipe
                                        </button>
                                    </div>

                                    <!-- Search Input -->
                                    <div class="position-relative" style="max-width: 480px;">
                                        <i class="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary"></i>
                                        <input type="text" id="home-search-input" value="${appState.searchQuery}" oninput="handleSearchInput(this.value)"
                                            placeholder="What are you craving today? (e.g. Lavender, Pasta)" class="form-control rounded-pill ps-5 py-3 shadow-sm border-0">
                                    </div>
                                </div>

                                <div class="col-lg-5">
                                    <div class="p-3 bg-white rounded-4 border shadow-sm" style="transform: rotate(1.5deg);">
                                        <img src="/images/tart.jpg" alt="Botanical Tartlet" class="img-fluid rounded-3 mb-3" style="height: 260px; width: 100%; object-fit: cover;">
                                        <span class="badge badge-sage text-uppercase mb-1">Featured Creation</span>
                                        <h4 class="font-serif fw-bold mb-2">Lavender & Wild Honey Tartlets</h4>
                                        <div class="d-flex justify-content-between align-items-center pt-2 border-top small text-secondary">
                                            <span><i class="fa-regular fa-clock me-1"></i> 45 mins total</span>
                                            <button onclick="navigateTo('single-recipe', {recipeId: 'recipe-1'})" class="btn btn-link p-0 fw-bold text-decoration-none" style="color: var(--sage-dark);">Read Story &rarr;</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <!-- Filter Bar & Pantry Assistant -->
                    <section id="recipe-section" class="container py-4">
                        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom pb-3 mb-4">
                            <div>
                                <h2 class="font-serif fw-bold h2 mb-1">Whimsical Kitchen Discoveries</h2>
                                <p class="small text-secondary mb-0">Filter by category or test your pantry ingredients</p>
                            </div>

                            <div class="d-flex align-items-center gap-2 overflow-auto pb-2">
                                ${['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Drinks'].map(cat => `
                                    <button onclick="setCategory('${cat}')" class="chip-btn ${appState.selectedCategory === cat ? 'active' : ''}">
                                        ${cat}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Pantry Finder Box -->
                        <div class="pantry-box">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="fw-bold mb-0" style="color: var(--sage-dark);">
                                    <i class="fa-solid fa-kitchen-set me-1"></i> What's in your fridge?
                                </h6>
                                ${appState.fridgeIngredients.length > 0 ? `
                                    <button onclick="clearFridgeFilter()" class="btn btn-link text-danger text-decoration-none small p-0 fw-semibold">Clear Ingredients</button>
                                ` : ''}
                            </div>
                            <div class="input-group mb-2">
                                <input id="fridge-input" type="text" placeholder="Type ingredient (e.g. Lavender, Butter) and press Add..."
                                    onkeypress="if(event.key==='Enter') addFridgeIngredient()" class="form-control rounded-start-3">
                                <button onclick="addFridgeIngredient()" class="btn btn-primary rounded-end-3" type="button">Add Item</button>
                            </div>
                            <div class="d-flex flex-wrap gap-2">
                                ${appState.fridgeIngredients.map((item, idx) => `
                                    <span class="badge bg-white text-dark border border-success border-opacity-25 p-2 rounded-3 small font-semibold">
                                        ${item}
                                        <i onclick="removeFridgeIngredient(${idx})" class="fa-solid fa-xmark ms-2 text-danger cursor-pointer"></i>
                                    </span>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Recipe Grid -->
                        <div class="row g-4">
                            ${filteredRecipes.length > 0 ? filteredRecipes.map(recipe => `
                                <div class="col-12 col-md-6 col-lg-4">
                                    ${renderRecipeCard(recipe)}
                                </div>
                            `).join('') : `
                                <div class="col-12 text-center py-5 bg-white rounded-4 border">
                                    <i class="fa-solid fa-seedling text-success opacity-50 display-4 mb-3"></i>
                                    <h4 class="font-serif fw-bold">No whimsical recipes found</h4>
                                    <p class="text-secondary small">Try resetting your search query or ingredient filters.</p>
                                    <button onclick="resetFilters()" class="btn btn-primary mt-2">Reset All Filters</button>
                                </div>
                            `}
                        </div>
                    </section>
                </div>
            `;
        }

        // Recipe Card Markup Renderer
        function renderRecipeCard(recipe) {
            const isBookmarked = appState.savedRecipeIds.has(recipe.id);
            return `
                <div onclick="navigateTo('single-recipe', {recipeId: '${recipe.id}'})" class="recipe-card">
                    <div>
                        <div class="card-img-wrapper">
                            <img src="${recipe.coverImage}" alt="${recipe.title}" onerror="this.src='https://placehold.co/600x400/3B2338/FAF6F0?text=Whimsy+Recipe'">
                            <span class="badge badge-sage position-absolute top-0 start-0 m-3">${recipe.category}</span>
                            <button onclick="toggleBookmark('${recipe.id}', event)" class="card-bookmark-btn ${isBookmarked ? 'active' : ''}">
                                <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                            </button>
                        </div>
                        <div class="p-3">
                            <div class="d-flex align-items-center gap-2 small fw-bold text-success mb-2" style="color: var(--sage-dark) !important;">
                                <span><i class="fa-solid fa-earth-americas me-1"></i> ${recipe.cuisine}</span>
                                <span>•</span>
                                <span><i class="fa-regular fa-clock me-1"></i> ${recipe.cookTime}</span>
                            </div>
                            <h5 class="font-serif fw-bold text-dark mb-2">${recipe.title}</h5>
                            <p class="small text-secondary mb-0 text-truncate-2" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${recipe.excerpt}</p>
                        </div>
                    </div>
                    <div class="p-3 border-top d-flex align-items-center justify-content-between small text-secondary">
                        <span><i class="fa-solid fa-user-pen me-1" style="color: var(--sage);"></i> ${recipe.author}</span>
                        <span class="fw-bold" style="color: var(--sage-dark);">Read &rarr;</span>
                    </div>
                </div>
            `;
        }

        // Filtering and Search Action Handlers
        function scrollToRecipes() {
            const el = document.getElementById('recipe-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }

        function setCategory(cat) {
            appState.selectedCategory = cat;
            renderApp();
        }

        function handleSearchInput(val) {
            appState.searchQuery = val;
            renderApp();
            const searchEl = document.getElementById('home-search-input');
            if (searchEl) {
                searchEl.focus();
                searchEl.setSelectionRange(val.length, val.length);
            }
        }

        // Pantry Ingredient Item Controls
        function addFridgeIngredient() {
            const input = document.getElementById('fridge-input');
            if (input && input.value.trim() !== '') {
                appState.fridgeIngredients.push(input.value.trim());
                renderApp();
            }
        }

        function removeFridgeIngredient(index) {
            appState.fridgeIngredients.splice(index, 1);
            renderApp();
        }

        function clearFridgeFilter() {
            appState.fridgeIngredients = [];
            renderApp();
        }

        function resetFilters() {
            appState.searchQuery = '';
            appState.selectedCategory = 'All';
            appState.fridgeIngredients = [];
            renderApp();
        }
