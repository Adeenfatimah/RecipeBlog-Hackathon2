const INITIAL_RECIPES = [
            {
                id: 'recipe-1',
                title: 'Lavender & Wild Honey Glazed Tartlets',
                excerpt: 'Delicate pastry crusts filled with botanical lavender custard and kissed with organic warm honey.',
                description: 'These whimsical tartlets combine fragrant culinary lavender with deep raw floral honey. Designed for quiet Sunday afternoons or enchanted garden tea parties.',
                category: 'Desserts',
                cuisine: 'French',
                prepTime: '25 min',
                cookTime: '20 min',
                servings: 6,
                difficulty: 'Medium',
                author: 'Flora Meadow',
                date: 'Sep 12, 2026',
                isUserPost: false,
                coverImage: '/images/tart.jpg',
                ingredients: [
                    { quantity: 1.5, unit: 'cups', name: 'All-purpose flour' },
                    { quantity: 0.5, unit: 'cups', name: 'Unsalted butter, chilled & cubed' },
                    { quantity: 2, unit: 'tbsp', name: 'Dried culinary lavender buds' },
                    { quantity: 0.25, unit: 'cups', name: 'Wildflower raw honey' },
                    { quantity: 3, unit: 'large', name: 'Egg yolks' },
                    { quantity: 1, unit: 'cup', name: 'Heavy cream' }
                ],
                steps: [
                    { instruction: 'In a food processor, pulse flour, chilled butter, and 1 tbsp lavender until coarse crumbs form.', timer: 0 },
                    { instruction: 'Press dough into mini tart tins and chill in refrigerator for 20 minutes.', timer: 20 },
                    { instruction: 'Bake dough shells at 375°F (190°C) until golden brown.', timer: 15 },
                    { instruction: 'Heat heavy cream with remaining lavender buds; steep for 10 mins then strain.', timer: 10 },
                    { instruction: 'Whisk egg yolks and honey, then temper with warm cream. Cook on low until thickened custard forms.', timer: 8 },
                    { instruction: 'Pour custard into baked shells, chill completely, and drizzle with golden honey before serving.', timer: 0 }
                ]
            },
            {
                id: 'recipe-2',
                title: 'Creamy Sage Butter Pappardelle',
                excerpt: 'Silky handmade egg noodles tossed in browned butter infused with crispy fresh garden sage leaves.',
                description: 'A deeply comforting Italian classic elevated with high-butterfat European butter and earthy sage leaves harvested at dawn.',
                category: 'Lunch',
                cuisine: 'Italian',
                prepTime: '15 min',
                cookTime: '12 min',
                servings: 4,
                difficulty: 'Easy',
                author: 'Chef Lorenzo',
                date: 'Sep 15, 2026',
                isUserPost: false,
                coverImage: '/images/noodle.jpg',
                ingredients: [
                    { quantity: 400, unit: 'grams', name: 'Fresh Pappardelle pasta' },
                    { quantity: 100, unit: 'grams', name: 'Unsalted butter' },
                    { quantity: 20, unit: 'whole', name: 'Fresh sage leaves' },
                    { quantity: 0.5, unit: 'cups', name: 'Freshly grated Parmigiano-Reggiano' }
                ],
                steps: [
                    { instruction: 'Bring a large pot of heavily salted water to a rolling boil.', timer: 0 },
                    { instruction: 'Melt butter in a skillet over medium heat until it foams and turns golden brown.', timer: 5 },
                    { instruction: 'Add fresh sage leaves to the brown butter and fry until crispy.', timer: 2 },
                    { instruction: 'Boil pappardelle pasta for 3-4 minutes until al dente.', timer: 4 },
                    { instruction: 'Toss pasta directly into sage butter with 1/2 cup pasta water and parmesan.', timer: 2 }
                ]
            },
            {
                id: 'recipe-3',
                title: 'Aromatic Cardamom & Rose Karak Tea',
                excerpt: 'Slow-simmered rich spiced tea brewed with green cardamom pods, saffron, and dried pink rose petals.',
                description: 'This soothing golden beverage fills the entire kitchen with aromatic spices. Brewed twice with evaporated milk for a luxurious texture.',
                category: 'Drinks',
                cuisine: 'Pakistani',
                prepTime: '5 min',
                cookTime: '15 min',
                servings: 2,
                difficulty: 'Easy',
                author: 'Ayesha Khan',
                date: 'Sep 17, 2026',
                isUserPost: false,
                coverImage: '/images/chai.jpg',
                ingredients: [
                    { quantity: 2, unit: 'cups', name: 'Filtered water' },
                    { quantity: 2, unit: 'tbsp', name: 'Strong black loose leaf tea' },
                    { quantity: 4, unit: 'pods', name: 'Green cardamom, crushed' },
                    { quantity: 1, unit: 'can', name: 'Evaporated milk' }
                ],
                steps: [
                    { instruction: 'In a saucepan, bring water, crushed cardamom, and black tea leaves to a boil.', timer: 5 },
                    { instruction: 'Reduce heat and simmer vigorously to extract rich spice oil.', timer: 5 },
                    { instruction: 'Pour in evaporated milk and sugar; bring to a high boil twice.', timer: 5 }
                ]
            }
        ];

        // Central Application State Store
        let appState = {
            currentUser: null,
            recipes: [],
            savedRecipeIds: new Set(),
            currentView: 'home',
            activeRecipeId: null,
            editingRecipeId: null,
            searchQuery: '',
            selectedCategory: 'All',
            selectedCuisineFilter: 'All',
            fridgeIngredients: [],
            cookState: {
                recipe: null,
                currentStepIndex: 0,
                timerSeconds: 0,
                timerInitial: 0,
                timerInterval: null,
                isTimerRunning: false
            }
        };

        // LocalStorage Initialization & Persistence Functions
        function initStorage() {
            const savedRecipes = localStorage.getItem('whimsy_recipes');
            if (savedRecipes) {
                appState.recipes = JSON.parse(savedRecipes);
                INITIAL_RECIPES.forEach(initR => {
                    if (!appState.recipes.some(r => r.id === initR.id)) {
                        appState.recipes.push(initR);
                    }
                });
            } else {
                appState.recipes = [...INITIAL_RECIPES];
            }
            saveRecipesToStorage();

            const savedBookmarks = localStorage.getItem('whimsy_bookmarks');
            if (savedBookmarks) appState.savedRecipeIds = new Set(JSON.parse(savedBookmarks));

            const savedUser = localStorage.getItem('whimsy_user');
            if (savedUser) appState.currentUser = JSON.parse(savedUser);
        }

        function saveRecipesToStorage() {
            localStorage.setItem('whimsy_recipes', JSON.stringify(appState.recipes));
        }

        function saveBookmarksToStorage() {
            localStorage.setItem('whimsy_bookmarks', JSON.stringify([...appState.savedRecipeIds]));
        }

        function saveUserToStorage() {
            if (appState.currentUser) localStorage.setItem('whimsy_user', JSON.stringify(appState.currentUser));
            else localStorage.removeItem('whimsy_user');
        }

        // Navigation & View Routing Engine
        function navigateTo(view, params = {}) {
            appState.currentView = view;
            if (params.recipeId) appState.activeRecipeId = params.recipeId;
            if (params.editId) appState.editingRecipeId = params.editId;
            if (params.cuisine) appState.selectedCuisineFilter = params.cuisine;

            window.scrollTo({ top: 0, behavior: 'smooth' });
            renderApp();
        }

        // Bookmark Toggle Logic
        function toggleBookmark(recipeId, e) {
            if (e) e.stopPropagation();
            if (appState.savedRecipeIds.has(recipeId)) {
                appState.savedRecipeIds.delete(recipeId);
                showToast('Removed from saved collection');
            } else {
                appState.savedRecipeIds.add(recipeId);
                showToast('Saved to your whimsical collection!');
            }
            saveBookmarksToStorage();
            renderApp();
        }

        // Toast Notification Helper
        function showToast(message, icon = 'fa-circle-check') {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-message');
            const toastIcon = document.getElementById('toast-icon');

            toastMsg.textContent = message;
            toastIcon.className = `fa-solid ${icon} text-warning fs-5`;

            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        // Authentication & Navbar UI Rendering
        function renderNavbarAuth() {
            const container = document.getElementById('nav-auth-container');
            if (!container) return;

            if (appState.currentUser) {
                container.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                        <div class="rounded-circle bg-success-subtle text-success-emphasis fw-bold d-flex align-items-center justify-content-center" style="width:36px; height:36px; font-size: 0.85rem;">
                            ${appState.currentUser.name.charAt(0).toUpperCase()}
                        </div>
                        <span class="small fw-semibold text-dark me-2">${appState.currentUser.name}</span>
                        <button onclick="logout()" class="btn btn-outline py-1 px-3 small" id="logoutBtn">Logout</button>
                    </div>
                `;
            } else {
                container.innerHTML = `
                    <button onclick="navigateTo('login')" class="btn btn-outline py-1 px-3">Log In</button>
                    <button onclick="navigateTo('signup')" class="btn btn-primary py-1 px-3">Sign Up</button>
                `;
            }
        }

        function logout() {
            appState.currentUser = null;
            saveUserToStorage();
            showToast('Logged out safely.');
            navigateTo('home');
        }

const supabaseUrl = "https://lbonxqgfhcqyxsrnnkpl.supabase.co";
const supabaseKey = "sb_publishable_eCFhEEDQsh3lco5S5NhTcQ_uh_yehfI";

const { createClient } = supabase;

const client = createClient(supabaseUrl, supabaseKey)

console.log(client);

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

  const { error } = await supabase.auth.signOut();


  if (error) {

    alert(error.message);

    return;
  }


  appState.currentUser = null;
    saveUserToStorage();
    showToast('Logged out safely.');
    navigateTo('home');
})