let currentServingMultiplier = 1;

        function renderSingleRecipePage() {
            const recipe = appState.recipes.find(r => r.id === appState.activeRecipeId) || appState.recipes[0];
            const isBookmarked = appState.savedRecipeIds.has(recipe.id);

            return `
                <div class="container py-4">
                    <!-- Breadcrumb Navigation -->
                    <nav class="small mb-3">
                        <a href="#" onclick="navigateTo('home'); return false;" class="text-secondary text-decoration-none">Home</a> /
                        <a href="#" onclick="filterByCuisine('${recipe.cuisine}'); return false;" class="text-secondary text-decoration-none">${recipe.cuisine}</a> /
                        <span class="fw-semibold text-dark">${recipe.title}</span>
                    </nav>

                    <!-- Recipe Title Header -->
                    <div class="mb-4">
                        <div class="d-flex gap-2 mb-2">
                            <span class="badge badge-lavender">${recipe.category}</span>
                            <span class="badge badge-sage">${recipe.cuisine} Cuisine</span>
                            <span class="badge badge-gold">${recipe.difficulty} Level</span>
                        </div>
                        <h1 class="display-5 font-serif fw-bold mb-3">${recipe.title}</h1>
                        <p class="lead fst-italic border-start border-3 border-success ps-3 text-secondary mb-3">${recipe.excerpt}</p>

                        <div class="d-flex flex-wrap align-items-center justify-content-between border-top border-bottom py-3 gap-3 small">
                            <div class="d-flex align-items-center gap-2">
                                <div class="rounded-circle bg-success-subtle text-success-emphasis fw-bold d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
                                    ${recipe.author.charAt(0)}
                                </div>
                                <div>
                                    <p class="fw-bold mb-0">${recipe.author}</p>
                                    <p class="text-secondary small mb-0">Published on ${recipe.date}</p>
                                </div>
                            </div>
                            <div class="d-flex gap-2">
                                <button onclick="toggleBookmark('${recipe.id}', event)" class="btn btn-outline py-2 px-3">
                                    <i class="${isBookmarked ? 'fa-solid text-danger' : 'fa-regular'} fa-heart me-1"></i>
                                    ${isBookmarked ? 'Saved' : 'Save Recipe'}
                                </button>
                                <button onclick="window.print()" class="btn btn-outline py-2 px-3"><i class="fa-solid fa-print me-1"></i> Print</button>
                            </div>
                        </div>
                    </div>

                    <!-- Recipe Banner Image -->
                    <div class="mb-4 rounded-4 overflow-hidden border shadow-sm" style="height: 380px;">
                        <img src="${recipe.coverImage}" alt="${recipe.title}" class="w-100 h-100" style="object-fit: cover;">
                    </div>

                    <!-- Recipe Attributes Stats Grid -->
                    <div class="row g-3 mb-4">
                        <div class="col-6 col-md-3">
                            <div class="bg-white p-3 rounded-4 border text-center">
                                <i class="fa-regular fa-clock fs-4" style="color: var(--sage);"></i>
                                <span class="d-block small text-muted text-uppercase fw-bold mt-1">Prep Time</span>
                                <span class="fw-bold text-dark">${recipe.prepTime}</span>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="bg-white p-3 rounded-4 border text-center">
                                <i class="fa-solid fa-fire fs-4 text-warning"></i>
                                <span class="d-block small text-muted text-uppercase fw-bold mt-1">Cook Time</span>
                                <span class="fw-bold text-dark">${recipe.cookTime}</span>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="bg-white p-3 rounded-4 border text-center">
                                <i class="fa-solid fa-users fs-4" style="color: var(--plum-light);"></i>
                                <span class="d-block small text-muted text-uppercase fw-bold mt-1">Servings</span>
                                <span class="fw-bold text-dark">${recipe.servings} base</span>
                            </div>
                        </div>
                        <div class="col-6 col-md-3">
                            <div class="bg-white p-3 rounded-4 border text-center">
                                <i class="fa-solid fa-utensils fs-4" style="color: var(--sage);"></i>
                                <span class="d-block small text-muted text-uppercase fw-bold mt-1">Difficulty</span>
                                <span class="fw-bold text-dark">${recipe.difficulty}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Interactive Cook Mode Banner -->
                    <div class="p-4 rounded-4 mb-4 text-white d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm" style="background: linear-gradient(135deg, var(--sage) 0%, var(--sage-dark) 100%);">
                        <div>
                            <h4 class="font-serif fw-bold mb-1">Ready to cook this recipe?</h4>
                            <p class="small text-light text-opacity-90 mb-0">Launch distraction-free Cook Mode with built-in step timers.</p>
                        </div>
                        <button onclick="startCookMode('${recipe.id}')" class="btn btn-gold">
                            <i class="fa-solid fa-circle-play me-1"></i> Launch Cook Mode
                        </button>
                    </div>

                    <!-- Story & Overview Box -->
                    <div class="bg-white p-4 rounded-4 border mb-4">
                        <h4 class="font-serif fw-bold mb-2">About This Story</h4>
                        <p class="text-secondary mb-0" style="line-height: 1.7;">${recipe.description}</p>
                    </div>

                    <!-- Ingredients List & Preparation Steps Grid -->
                    <div class="row g-4">
                        <!-- Scalable Ingredients Column -->
                        <div class="col-lg-5">
                            <div class="bg-white p-4 rounded-4 border h-100">
                                <div class="d-flex justify-content-between align-items-center pb-3 border-bottom mb-3">
                                    <h4 class="font-serif fw-bold mb-0">Ingredients</h4>
                                    <div class="d-flex align-items-center gap-1 bg-light p-1 rounded-3 small">
                                        <span class="me-1">Scale:</span>
                                        <button onclick="adjustMultiplier(-0.5)" class="btn btn-outline py-0 px-2 small">-</button>
                                        <span class="fw-bold px-1" style="color: var(--sage-dark);">${currentServingMultiplier}x</span>
                                        <button onclick="adjustMultiplier(0.5)" class="btn btn-outline py-0 px-2 small">+</button>
                                    </div>
                                </div>

                                <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
                                    ${recipe.ingredients.map((ing, idx) => {
                                        const scaledQty = ing.quantity ? (ing.quantity * currentServingMultiplier).toFixed(1).replace(/\.0$/, '') : '';
                                        return `
                                            <li class="d-flex align-items-start gap-2 small">
                                                <input type="checkbox" id="ing-${idx}" class="form-check-input mt-1">
                                                <label for="ing-${idx}" class="form-check-label">
                                                    <span class="fw-bold" style="color: var(--sage-dark);">${scaledQty} ${ing.unit}</span>${ing.name}
                                                </label>
                                            </li>
                                        `;
                                    }).join('')}
                                </ul>
                            </div>
                        </div>

                        <!-- Step-by-Step Instructions Column -->
                        <div class="col-lg-7">
                            <div class="bg-white p-4 rounded-4 border h-100">
                                <h4 class="font-serif fw-bold pb-3 border-bottom mb-4">Step-by-Step Instructions</h4>

                                <div class="d-flex flex-column gap-4">
                                    ${recipe.steps.map((step, idx) => `
                                        <div class="d-flex gap-3">
                                            <div class="rounded-circle bg-success-subtle text-success-emphasis fw-bold d-flex align-items-center justify-content-center flex-shrink-0" style="width:36px; height:36px;">
                                                ${idx + 1}
                                            </div>
                                            <div>
                                                <p class="mb-1 text-dark" style="line-height: 1.6;">${step.instruction}</p>${step.timer > 0 ? `
                                                    <div class="badge badge-gold mt-1">
                                                        <i class="fa-solid fa-stopwatch me-1"></i> Recommended Time: ${step.timer} minutes
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Ingredient Serving Multiplier Adjuster
        function adjustMultiplier(delta) {
            currentServingMultiplier = Math.max(0.5, currentServingMultiplier + delta);
            renderApp();
        }

        // Cuisine Navigation Trigger
        function filterByCuisine(cuisineName) {
            appState.selectedCuisineFilter = cuisineName;
            appState.searchQuery = '';
            appState.selectedCategory = 'All';
            navigateTo('explore');
        }

        // Cook Mode Fullscreen Overlay Controls & Logic
        function startCookMode(recipeId) {
            const recipe = appState.recipes.find(r => r.id === recipeId);
            if (!recipe) return;

            appState.cookState = {
                recipe: recipe,
                currentStepIndex: 0,
                timerSeconds: (recipe.steps[0].timer || 0) * 60,
                timerInitial: (recipe.steps[0].timer || 0) * 60,
                timerInterval: null,
                isTimerRunning: false
            };

            const overlay = document.getElementById('cook-mode-overlay');
            overlay.classList.add('active');
            renderCookMode();
        }

        function closeCookMode() {
            clearInterval(appState.cookState.timerInterval);
            document.getElementById('cook-mode-overlay').classList.remove('active');
        }

        function renderCookMode() {
            const overlay = document.getElementById('cook-mode-overlay');
            const { recipe, currentStepIndex, timerSeconds, isTimerRunning } = appState.cookState;
            const step = recipe.steps[currentStepIndex];
            const totalSteps = recipe.steps.length;
            const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

            const mins = Math.floor(timerSeconds / 60);
            const secs = timerSeconds % 60;
            const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

            overlay.innerHTML = `
                <div class="container my-auto" style="max-width: 760px;">
                    <div class="d-flex align-items-center justify-content-between pb-3 border-bottom mb-3">
                        <span class="small fw-bold text-success"><i class="fa-solid fa-circle me-1"></i> Cook Mode Active</span>
                        <h4 class="font-serif fw-bold mb-0">${recipe.title}</h4>
                        <button onclick="closeCookMode()" class="btn-close"></button>
                    </div>

                    <!-- Step Progress Indicator -->
                    <div class="progress rounded-pill mb-4" style="height: 8px;">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${progressPercent}%;"></div>
                    </div>

                    <div class="my-4 text-center">
                        <span class="badge badge-sage mb-3">Step ${currentStepIndex + 1} of ${totalSteps}</span>
                        <h2 class="font-serif fw-semibold display-6 text-dark my-3">"${step.instruction}"</h2>

                        ${appState.cookState.timerInitial > 0 ? `
                            <div class="p-4 rounded-4 border bg-warning-subtle mx-auto text-start mt-4" style="max-width: 400px;">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="small fw-bold text-uppercase text-secondary">Step Timer</span>
                                    <span class="display-6 font-monospace fw-bold">${formattedTime}</span>
                                </div>
                                <div class="d-flex gap-2">
                                    <button onclick="toggleTimer()" class="btn btn-gold flex-grow-1">
                                        <i class="fa-solid ${isTimerRunning ? 'fa-pause' : 'fa-play'} me-1"></i> ${isTimerRunning ? 'Pause' : 'Start Timer'}
                                    </button>
                                    <button onclick="resetTimer()" class="btn btn-outline">Reset</button>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    <div class="d-flex justify-content-between align-items-center pt-4 border-top">
                        <button onclick="prevStep()" ${currentStepIndex === 0 ? 'disabled' : ''} class="btn btn-outline">
                            &larr; Previous Step
                        </button>

                        ${currentStepIndex < totalSteps - 1 ? `
                            <button onclick="nextStep()" class="btn btn-primary">Next Step &rarr;</button>
                        ` : `
                            <button onclick="finishCooking()" class="btn btn-gold">Finish Recipe 🎉</button>
                        `}
                    </div>
                </div>
            `;
        }

        // Cook Mode Timer Management Functions
        function toggleTimer() {
            const cState = appState.cookState;
            if (cState.isTimerRunning) {
                clearInterval(cState.timerInterval);
                cState.isTimerRunning = false;
            } else {
                cState.isTimerRunning = true;
                cState.timerInterval = setInterval(() => {
                    if (cState.timerSeconds > 0) {
                        cState.timerSeconds--;
                        renderCookMode();
                    } else {
                        clearInterval(cState.timerInterval);
                        cState.isTimerRunning = false;
                        showToast('Timer Complete!', 'fa-bell');
                        renderCookMode();
                    }
                }, 1000);
            }
            renderCookMode();
        }

        function resetTimer() {
            clearInterval(appState.cookState.timerInterval);
            appState.cookState.isTimerRunning = false;
            appState.cookState.timerSeconds = appState.cookState.timerInitial;
            renderCookMode();
        }

        function nextStep() {
            clearInterval(appState.cookState.timerInterval);
            appState.cookState.isTimerRunning = false;
            appState.cookState.currentStepIndex++;
            const step = appState.cookState.recipe.steps[appState.cookState.currentStepIndex];
            appState.cookState.timerSeconds = (step.timer || 0) * 60;
            appState.cookState.timerInitial = (step.timer || 0) * 60;
            renderCookMode();
        }

        function prevStep() {
            if (appState.cookState.currentStepIndex > 0) {
                clearInterval(appState.cookState.timerInterval);
                appState.cookState.isTimerRunning = false;
                appState.cookState.currentStepIndex--;
                const step = appState.cookState.recipe.steps[appState.cookState.currentStepIndex];
                appState.cookState.timerSeconds = (step.timer || 0) * 60;
                appState.cookState.timerInitial = (step.timer || 0) * 60;
                renderCookMode();
            }
        }

        function finishCooking() {
            closeCookMode();
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            showToast('Congratulations! Recipe completed delightfully! 🎉');
        }
