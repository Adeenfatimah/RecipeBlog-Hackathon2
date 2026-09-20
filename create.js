let formIngredients = [];
        let formSteps = [];

        function renderCreateEditPostPage(isEdit = false) {
            if (!appState.currentUser) {
                showToast('Please log in to share or edit recipes!', 'fa-lock');
                navigateTo('login');
                return '';
            }

            let recipe = {
                title: '', category: 'Breakfast', cuisine: 'Italian', prepTime: '15 min', cookTime: '20 min',
                servings: 4, difficulty: 'Easy', excerpt: '', description: '', coverImage: ''
            };

            if (isEdit && appState.editingRecipeId) {
                const found = appState.recipes.find(r => r.id === appState.editingRecipeId);
                if (found) {
                    recipe = { ...found };
                    formIngredients = [...found.ingredients];
                    formSteps = [...found.steps];
                }
            } else if (!isEdit) {
                if (formIngredients.length === 0) formIngredients = [{ quantity: 1, unit: 'cup', name: 'Fresh Ingredient' }];
                if (formSteps.length === 0) formSteps = [{ instruction: 'Mix ingredients together gently.', timer: 5 }];
            }

            return `
                <div class="container py-4" style="max-width: 800px;">
                    <div class="mb-4">
                        <span class="font-whimsy fs-2" style="color: var(--sage);">${isEdit ? 'Refine Creation' : 'Kitchen Journal'}</span>
                        <h1 class="font-serif fw-bold h2 mb-0">${isEdit ? 'Edit Recipe Story' : 'Share Your Kitchen Story'}</h1>
                    </div>

                    <form onsubmit="handleFormSubmit(event, ${isEdit})" class="bg-white p-4 rounded-4 border shadow-sm" id="recipeForm">
                        <div class="mb-3">
                            <label class="form-label small fw-bold text-uppercase text-secondary">Recipe Title</label>
                            <input type="text" id="recipe-title" required value="${recipe.title}" placeholder="e.g. Cardamom & Vanilla Bean Scones" class="form-control" id="title">
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Category</label>
                                <select id="recipe-category" class="form-select" id="category">
                                    ${['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks', 'Drinks'].map(cat => `<option value="${cat}" ${recipe.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Cuisine</label>
                                <input type="text" id="recipe-cuisine" required value="${recipe.cuisine}" placeholder="e.g. French, Pakistani" class="form-control" >
                            </div>
                        </div>

                        <div class="row g-3 mb-3">
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Prep / Cook Time</label>
                                <div class="input-group">
                                    <input type="text" id="recipe-prep" value="${recipe.prepTime}" placeholder="15 min" class="form-control">
                                    <input type="text" id="recipe-cook" value="${recipe.cookTime}" placeholder="20 min" class="form-control">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label small fw-bold text-uppercase text-secondary">Servings / Difficulty</label>
                                <div class="input-group">
                                    <input type="number" id="recipe-servings" value="${recipe.servings}" class="form-control">
                                    <select id="recipe-difficulty" class="form-select">
                                        <option ${recipe.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                                        <option ${recipe.difficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                                        <option ${recipe.difficulty === 'Hard' ? 'selected' : ''}>Hard</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold text-uppercase text-secondary">Short Excerpt</label>
                            <input type="text" id="recipe-excerpt" required value="${recipe.excerpt}" placeholder="Quick summary for preview cards..." class="form-control">
                        </div>

                        <div class="mb-3">
                            <label class="form-label small fw-bold text-uppercase text-secondary">Full Story & Details</label>
                            <textarea id="recipe-desc" rows="4" required class="form-control" id="decription">${recipe.description}</textarea>
                        </div>

                        <div class="mb-4">
    <label class="form-label small fw-bold text-uppercase text-secondary">Recipe Image</label>
    
    <!-- File Upload Input -->
    <input 
        type="file" 
        id="recipe-image-file" 
        accept="image/*" 
        onchange="handleImageUpload(event)" 
        class="form-control mb-2"
    >
    
    <!-- URL Input Fallback -->
    <input 
        type="url" 
        id="recipe-image" 
        value="${recipe.coverImage}" 
        placeholder="Or paste image URL (https://...)" 
        class="form-control"
    >
    
    <!-- Preview Box -->
    <div id="image-preview-container" class="mt-2 ${recipe.coverImage ? "" : "d-none"}">
        <img 
            id="recipe-image-preview" 
            src="${recipe.coverImage || ""}" 
            alt="Preview" 
            class="img-thumbnail rounded-3" 
            style="max-height: 200px; object-fit: cover;"
            id="recipeImage"
        >
    </div>

                        <!-- Dynamic Ingredients Builder -->
                        <div class="pt-3 border-top mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="font-serif fw-bold mb-0">Ingredients</h5>
                                <button type="button" onclick="addIngredientRow()" class="btn btn-outline py-1 px-3 small">+ Add Row</button>
                            </div>
                            ${formIngredients.map((ing, i) => `
                                <div class="row g-2 mb-2 align-items-center">
                                    <div class="col-3">
                                        <input type="number" step="0.1" value="${ing.quantity}" onchange="formIngredients[${i}].quantity=parseFloat(this.value)" class="form-control" placeholder="Qty">
                                    </div>
                                    <div class="col-3">
                                        <input type="text" value="${ing.unit}" placeholder="Unit" onchange="formIngredients[${i}].unit=this.value" class="form-control">
                                    </div>
                                    <div class="col-5">
                                        <input type="text" value="${ing.name}" placeholder="Ingredient Name" onchange="formIngredients[${i}].name=this.value" class="form-control">
                                    </div>
                                    <div class="col-1 text-end">
                                        <button type="button" onclick="removeIngredientRow(${i})" class="btn btn-link text-danger p-0"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <!-- Dynamic Instructions Steps Builder -->
                        <div class="pt-3 border-top mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="font-serif fw-bold mb-0">Instructions</h5>
                                <button type="button" onclick="addStepRow()" class="btn btn-outline py-1 px-3 small">+ Add Step</button>
                            </div>
                            ${formSteps.map((step, i) => `
                                <div class="bg-light p-3 rounded-3 mb-2">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="fw-bold small text-success">${i+1}. Step Details</span>
                                        <button type="button" onclick="removeStepRow(${i})" class="btn btn-link text-danger p-0"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                    <textarea rows="2" placeholder="Step instruction..." onchange="formSteps[${i}].instruction=this.value" class="form-control mb-2">${step.instruction}</textarea>
                                    <div style="max-width: 140px;">
                                        <label class="small text-uppercase fw-bold text-secondary" style="font-size:0.65rem;">Timer (minutes)</label>
                                        <input type="number" value="${step.timer}" onchange="formSteps[${i}].timer=parseInt(this.value)||0" class="form-control">
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div class="d-flex justify-content-end gap-2 pt-3 border-top">
                            <button type="button" onclick="navigateTo('dashboard')" class="btn btn-outline">Cancel</button>
                            <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Publish Story'}</button>
                        </div>
                    </form>
                </div>
            `;
        }

        function addIngredientRow() {
            formIngredients.push({ quantity: 1, unit: 'cup', name: '' });
            renderApp();
        }

        function removeIngredientRow(index) {
            formIngredients.splice(index, 1);
            renderApp();
        }

        function addStepRow() {
            formSteps.push({ instruction: '', timer: 0 });
            renderApp();
        }

        function removeStepRow(index) {
            formSteps.splice(index, 1);
            renderApp();
        }

        // Recipe Creation / Update Form Handler
        function handleFormSubmit(e, isEdit) {
            e.preventDefault();
            const title = document.getElementById('recipe-title').value;
            const category = document.getElementById('recipe-category').value;
            const cuisine = document.getElementById('recipe-cuisine').value;
            const prepTime = document.getElementById('recipe-prep').value || '15 min';
            const cookTime = document.getElementById('recipe-cook').value || '20 min';
            const servings = parseInt(document.getElementById('recipe-servings').value) || 4;
            const difficulty = document.getElementById('recipe-difficulty').value;
            const excerpt = document.getElementById('recipe-excerpt').value;
            const description = document.getElementById('recipe-desc').value;
            const coverImage = document.getElementById('recipe-image').value || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&w=800&q=80';

            if (isEdit) {
                const idx = appState.recipes.findIndex(r => r.id === appState.editingRecipeId);
                if (idx !== -1) {
                    appState.recipes[idx] = {
                        ...appState.recipes[idx],
                        title, category, cuisine, prepTime, cookTime, servings, difficulty, excerpt, description, coverImage,
                        ingredients: formIngredients, steps: formSteps
                    };
                }
                showToast('Recipe updated successfully!');
            } else {
                const newRecipe = {
                    id: 'recipe-' + Date.now(),
                    title, category, cuisine, prepTime, cookTime, servings, difficulty, excerpt, description, coverImage,
                    author: appState.currentUser.name,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    isUserPost: true,
                    ingredients: formIngredients,
                    steps: formSteps
                };
                appState.recipes.unshift(newRecipe);
                showToast('New story published to Whimsy!');
            }

            saveRecipesToStorage();
            formIngredients = [];
            formSteps = [];
            navigateTo('dashboard');
        }


