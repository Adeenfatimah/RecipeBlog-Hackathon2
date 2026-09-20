function renderDashboardPage() {
            if (!appState.currentUser) {
                showToast('Please log in to access dashboard!', 'fa-lock');
                navigateTo('login');
                return '';
            }

            const myRecipes = appState.recipes.filter(r => r.isUserPost || r.author === appState.currentUser.name);

            return `
                <div class="container py-4">
                    <!-- User Profile Header Summary -->
                    <div class="bg-white p-4 rounded-4 border shadow-sm d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                        <div class="d-flex align-items-center gap-3">
                            <div class="rounded-circle bg-success text-white fw-bold d-flex align-items-center justify-content-center display-6" style="width:56px; height:56px;">
                                ${appState.currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 class="font-serif fw-bold mb-0">${appState.currentUser.name}</h3>
                                <p class="text-secondary small mb-0">${appState.currentUser.email}</p>
                            </div>
                        </div>
                        <div class="d-flex gap-3">
                            <div class="bg-light p-2 px-3 rounded-3 text-center">
                                <span class="d-block fw-bold h5 text-success mb-0">${myRecipes.length}</span>
                                <span class="small text-muted text-uppercase fw-bold" style="font-size:0.65rem;">Recipes</span>
                            </div>
                            <div class="bg-light p-2 px-3 rounded-3 text-center">
                                <span class="d-block fw-bold h5 text-warning mb-0">${appState.savedRecipeIds.size}</span>
                                <span class="small text-muted text-uppercase fw-bold" style="font-size:0.65rem;">Bookmarks</span>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="font-serif fw-bold mb-0">My Kitchen Stories</h3>
                        <button onclick="navigateTo('create')" class="btn btn-primary">+ Create New Post</button>
                    </div>

                    ${myRecipes.length > 0 ? `
                        <div class="row g-3">
                            ${myRecipes.map(recipe => `
                                <div class="col-12 col-md-6 col-lg-4">
                                    <div class="bg-white p-3 rounded-4 border shadow-sm d-flex flex-column justify-content-between h-100">
                                        <div class="d-flex gap-3 mb-3">
                                            <img src="${recipe.coverImage}" class="rounded-3" style="width: 72px; height: 72px; object-fit: cover;" onerror="this.src='https://placehold.co/200?text=Recipe'">
                                            <div>
                                                <span class="badge badge-sage mb-1">${recipe.category}</span>
                                                <h6 class="fw-bold mb-1">${recipe.title}</h6>
                                                <p class="small text-muted mb-0">${recipe.date}</p>
                                            </div>
                                        </div>
                                        <div class="d-flex gap-2 pt-2 border-top">
                                            <button onclick="navigateTo('single-recipe', {recipeId: '${recipe.id}'})" class="btn btn-outline flex-grow-1 py-1 small">View</button>
                                            <button onclick="navigateTo('edit', {editId: '${recipe.id}'})" class="btn btn-outline py-1 px-3 small"><i class="fa-solid fa-pen"></i></button>
                                            <button onclick="openDeleteModal('${recipe.id}')" class="btn btn-outline-danger py-1 px-3 small rounded-3"><i class="fa-solid fa-trash"></i></button>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="text-center py-5 bg-white rounded-4 border">
                            <i class="fa-solid fa-book-open text-muted opacity-50 display-4 mb-3"></i>
                            <h4 class="font-serif fw-bold">You haven't created any recipes yet</h4>
                            <button onclick="navigateTo('create')" class="btn btn-primary mt-2">Create Your First Recipe</button>
                        </div>
                    `}
                </div>
            `;
        }

        // Delete Confirmation Modal Invoker
        let idToDelete = null;
        function openDeleteModal(recipeId) {
            idToDelete = recipeId;
            const modalEl = document.getElementById('deleteModal');
            const bsModal = new bootstrap.Modal(modalEl);
            bsModal.show();

            document.getElementById('confirm-delete-btn').onclick = function() {
                if (idToDelete) {
                    appState.recipes = appState.recipes.filter(r => r.id !== idToDelete);
                    saveRecipesToStorage();
                    bsModal.hide();
                    showToast('Recipe deleted.');
                    renderApp();
                }
            };
        }