// SmartChef Recipe Finder App
// API Configuration
const API_CONFIG = {
    // Replace with your Spoonacular API key
    // Get your free API key at: https://spoonacular.com/food-api
    API_KEY: CONFIG.API_KEY,
    BASE_URL: 'https://api.spoonacular.com/recipes',
    ENDPOINTS: {
        FIND_BY_INGREDIENTS: '/findByIngredients',
        GET_RECIPE_INFO: '/information'
    }
};

// Global state
let currentRecipes = [];
let isLoading = false;

// DOM Elements
const elements = {
    ingredientInput: document.getElementById('ingredientInput'),
    searchBtn: document.getElementById('searchBtn'),
    loadingIndicator: document.getElementById('loadingIndicator'),
    errorMessage: document.getElementById('errorMessage'),
    noResults: document.getElementById('noResults'),
    resultsGrid: document.getElementById('resultsGrid'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('.section'),
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    recipeModal: document.getElementById('recipeModal'),
    modalContent: document.getElementById('modalContent'),
    closeModal: document.querySelector('.close'),
    contactForm: document.querySelector('.contact-form')
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    setupNavigation();
    setupContactForm();
    checkApiKey();
}

// Event Listeners
function setupEventListeners() {
    // Search functionality
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.ingredientInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Suggestion tags
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', function() {
            addIngredientToInput(this.dataset.ingredient);
        });
    });

    // Modal functionality
    elements.closeModal.addEventListener('click', closeModal);
    elements.recipeModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Mobile navigation
    elements.hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking on links
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                elements.navMenu.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !elements.hamburger.contains(e.target) && 
            !elements.navMenu.contains(e.target)) {
            elements.navMenu.classList.remove('active');
        }
    });
}

// Navigation functionality
function setupNavigation() {
    elements.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href').replace('#', '');
            window.location.hash = targetId; // update the URL hash
            showSection(targetId);
            updateActiveNavLink(this);
        });
    });

    // Show the correct section on page load (if hash exists)
    const initialHash = window.location.hash.replace('#', '') || 'home';
    showSection(initialHash);

    // Update when hash changes (e.g., back/forward buttons)
    window.addEventListener('hashchange', () => {
        const currentHash = window.location.hash.replace('#', '') || 'home';
        showSection(currentHash);
    });
}


function showSection(sectionId) {
    elements.sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function updateActiveNavLink(activeLink) {
    elements.navLinks.forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function toggleMobileMenu() {
    elements.navMenu.classList.toggle('active');
}

// Search functionality
async function handleSearch() {
    const ingredients = getIngredientsFromInput();
    
    if (!ingredients.length) {
        showError('Please enter at least one ingredient');
        return;
    }

    if (!API_CONFIG.API_KEY || API_CONFIG.API_KEY === 'YOUR_SPOONACULAR_API_KEY_HERE') {
        showError('API key not configured. Please add your Spoonacular API key to the script.js file.');
        return;
    }

    try {
        await searchRecipes(ingredients);
    } catch (error) {
        console.error('Search error:', error);
        // If API fails, show demo data as fallback
        if (error.message.includes('CORS') || error.message.includes('fetch')) {
            showError('API connection issue. Showing demo recipes instead.');
            setTimeout(() => {
                showSampleData();
            }, 2000);
        } else {
            showError(error.message);
        }
    }
}

function getIngredientsFromInput() {
    const input = elements.ingredientInput.value.trim();
    if (!input) return [];
    
    return input.split(',')
        .map(ingredient => ingredient.trim())
        .filter(ingredient => ingredient.length > 0);
}

function addIngredientToInput(ingredient) {
    const currentIngredients = getIngredientsFromInput();
    if (!currentIngredients.includes(ingredient)) {
        const newIngredients = [...currentIngredients, ingredient];
        elements.ingredientInput.value = newIngredients.join(', ');
    }
    elements.ingredientInput.focus();
}

// API Integration
async function searchRecipes(ingredients) {
    if (isLoading) return;
    
    isLoading = true;
    showLoading();
    hideError();
    hideNoResults();
    
    try {
        const recipes = await fetchRecipesByIngredients(ingredients);
        
        if (recipes.length === 0) {
            showNoResults();
        } else {
            currentRecipes = recipes;
            displayRecipes(recipes);
        }
    } catch (error) {
        console.error('Error searching recipes:', error);
        showError('Failed to fetch recipes. Please check your internet connection and try again.');
    } finally {
        isLoading = false;
        hideLoading();
    }
}

async function fetchRecipesByIngredients(ingredients) {
    const ingredientsString = ingredients.join(',');
    // Use JSONP or proxy to avoid CORS issues
    const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientsString)}&number=12&apiKey=${API_CONFIG.API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            if (response.status === 402) {
                throw new Error('API quota exceeded. Please try again later.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key. Please check your API key configuration.');
            } else if (response.status === 429) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            } else {
                throw new Error(`API request failed with status: ${response.status}`);
            }
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        // If CORS error, try with a different approach
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('CORS error: Please run this app from a local server or use the demo mode.');
        }
        throw error;
    }
}

async function fetchRecipeDetails(recipeId) {
    const url = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_CONFIG.API_KEY}`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recipe details');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch recipe details error:', error);
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('CORS error: Please run this app from a local server.');
        }
        throw error;
    }
}

// UI Updates
function showLoading() {
    elements.loadingIndicator.classList.remove('hidden');
    elements.resultsGrid.innerHTML = '';
}

function hideLoading() {
    elements.loadingIndicator.classList.add('hidden');
}

function showError(message) {
    elements.errorMessage.querySelector('p').textContent = message;
    elements.errorMessage.classList.remove('hidden');
    elements.resultsGrid.innerHTML = '';
}

function hideError() {
    elements.errorMessage.classList.add('hidden');
}

function showNoResults() {
    elements.noResults.classList.remove('hidden');
    elements.resultsGrid.innerHTML = '';
}

function hideNoResults() {
    elements.noResults.classList.add('hidden');
}

function displayRecipes(recipes) {
    elements.resultsGrid.innerHTML = '';
    
    recipes.forEach(recipe => {
        const recipeCard = createRecipeCard(recipe);
        elements.resultsGrid.appendChild(recipeCard);
    });
    
    // Animate cards
    const cards = elements.resultsGrid.querySelectorAll('.recipe-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    const imageUrl = recipe.image || 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=No+Image';
    const title = recipe.title || 'Untitled Recipe';
    const readyInMinutes = recipe.readyInMinutes || 'N/A';
    const servings = recipe.servings || 'N/A';
    const summary = recipe.summary ? cleanHtml(recipe.summary) : 'No description available';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${title}" class="recipe-image" loading="lazy">
        <div class="recipe-content">
            <h3 class="recipe-title">${title}</h3>
            <p class="recipe-description">${summary}</p>
            <div class="recipe-meta">
                <div class="recipe-time">
                    <i class="fas fa-clock"></i>
                    <span>${readyInMinutes} min</span>
                </div>
                <div class="recipe-servings">
                    <i class="fas fa-users"></i>
                    <span>${servings} servings</span>
                </div>
            </div>
            <button class="view-recipe-btn" onclick="viewRecipeDetails(${recipe.id})">
                <i class="fas fa-external-link-alt"></i>
                View Recipe
            </button>
        </div>
    `;
    
    return card;
}

function cleanHtml(html) {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
}

// Recipe Details Modal
async function viewRecipeDetails(recipeId) {
    try {
        showLoading();
        const recipeDetails = await fetchRecipeDetails(recipeId);
        displayRecipeModal(recipeDetails);
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        showError('Failed to load recipe details. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayRecipeModal(recipe) {
    const imageUrl = recipe.image || 'https://via.placeholder.com/400x300/ff6b6b/ffffff?text=No+Image';
    const title = recipe.title || 'Untitled Recipe';
    const readyInMinutes = recipe.readyInMinutes || 'N/A';
    const servings = recipe.servings || 'N/A';
    const summary = recipe.summary ? cleanHtml(recipe.summary) : 'No description available';
    const instructions = recipe.instructions ? cleanHtml(recipe.instructions) : 'No instructions available';
    const sourceUrl = recipe.sourceUrl || '#';
    
    elements.modalContent.innerHTML = `
        <div style="padding: 40px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
                <div>
                    <img src="${imageUrl}" alt="${title}" style="width: 100%; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                </div>
                <div>
                    <h2 style="color: #333; margin-bottom: 20px; font-size: 2rem;">${title}</h2>
                    <div style="display: flex; gap: 20px; margin-bottom: 20px; color: #666;">
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-clock"></i>
                            <span>${readyInMinutes} min</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <i class="fas fa-users"></i>
                            <span>${servings} servings</span>
                        </div>
                    </div>
                    <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">${summary}</p>
                    <a href="${sourceUrl}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #ff6b6b, #ff8e8e); color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-weight: 600; transition: transform 0.3s ease;">
                        <i class="fas fa-external-link-alt"></i>
                        View Full Recipe
                    </a>
                </div>
            </div>
            <div>
                <h3 style="color: #333; margin-bottom: 15px;">Instructions</h3>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; line-height: 1.6; color: #666;">
                    ${instructions}
                </div>
            </div>
        </div>
    `;
    
    elements.recipeModal.classList.remove('hidden');
}

function closeModal() {
    elements.recipeModal.classList.add('hidden');
}

// Contact Form
function setupContactForm() {
    elements.contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value
        };
        
        // Simulate form submission
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            alert('Thank you for your message! We\'ll get back to you soon.');
            this.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

// API Key Check
function checkApiKey() {
    if (!API_CONFIG.API_KEY || API_CONFIG.API_KEY === 'YOUR_SPOONACULAR_API_KEY_HERE') {
        console.warn('⚠️ Spoonacular API key not configured!');
        console.log('To use this app:');
        console.log('1. Go to https://spoonacular.com/food-api');
        console.log('2. Sign up for a free account');
        console.log('3. Get your API key');
        console.log('4. Replace "YOUR_SPOONACULAR_API_KEY_HERE" in script.js with your actual API key');
    } else {
        console.log('✅ API key configured! Make sure to run this app from a local server to avoid CORS issues.');
        console.log('💡 If you see API errors, the app will automatically show demo recipes instead.');
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add some sample data for demonstration when API key is not configured
function showSampleData() {
    const ingredients = getIngredientsFromInput();
    let sampleRecipes = [];
    
    // Generate relevant sample recipes based on ingredients
    if (ingredients.some(ing => ing.toLowerCase().includes('chicken'))) {
        sampleRecipes.push({
            id: 1,
            title: "Chicken and Rice Casserole",
            image: "https://images.unsplash.com/photo-1563379091339-03246963d2d0?w=400&h=300&fit=crop",
            readyInMinutes: 45,
            servings: 6,
            summary: "A comforting and hearty casserole that combines tender chicken with fluffy rice and vegetables. Perfect for a family dinner."
        });
    }
    
    if (ingredients.some(ing => ing.toLowerCase().includes('pasta') || ing.toLowerCase().includes('tomato'))) {
        sampleRecipes.push({
            id: 2,
            title: "Pasta with Tomato Sauce",
            image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
            readyInMinutes: 25,
            servings: 4,
            summary: "Classic Italian pasta dish with rich tomato sauce, garlic, and herbs. Simple yet delicious."
        });
    }
    
    if (ingredients.some(ing => ing.toLowerCase().includes('egg') || ing.toLowerCase().includes('cheese'))) {
        sampleRecipes.push({
            id: 3,
            title: "Cheesy Scrambled Eggs",
            image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
            readyInMinutes: 10,
            servings: 2,
            summary: "Creamy scrambled eggs with melted cheese. A perfect breakfast or quick meal."
        });
    }
    
    // If no specific matches, show general recipes
    if (sampleRecipes.length === 0) {
        sampleRecipes = [
            {
                id: 1,
                title: "Chicken and Rice Casserole",
                image: "https://images.unsplash.com/photo-1563379091339-03246963d2d0?w=400&h=300&fit=crop",
                readyInMinutes: 45,
                servings: 6,
                summary: "A comforting and hearty casserole that combines tender chicken with fluffy rice and vegetables. Perfect for a family dinner."
            },
            {
                id: 2,
                title: "Pasta with Tomato Sauce",
                image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
                readyInMinutes: 25,
                servings: 4,
                summary: "Classic Italian pasta dish with rich tomato sauce, garlic, and herbs. Simple yet delicious."
            },
            {
                id: 3,
                title: "Cheesy Scrambled Eggs",
                image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
                readyInMinutes: 10,
                servings: 2,
                summary: "Creamy scrambled eggs with melted cheese. A perfect breakfast or quick meal."
            },
            {
                id: 4,
                title: "Vegetable Stir Fry",
                image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop",
                readyInMinutes: 20,
                servings: 3,
                summary: "Fresh vegetables stir-fried with aromatic spices and a light sauce. Healthy, colorful, and packed with nutrients."
            },
            {
                id: 5,
                title: "Grilled Cheese Sandwich",
                image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop",
                readyInMinutes: 15,
                servings: 1,
                summary: "Classic grilled cheese sandwich with crispy bread and melted cheese. Comfort food at its finest."
            },
            {
                id: 6,
                title: "Chicken Noodle Soup",
                image: "https://images.unsplash.com/photo-1604909052743-94e838986d24?w=400&h=300&fit=crop",
                readyInMinutes: 35,
                servings: 6,
                summary: "Hearty chicken noodle soup with tender chicken, vegetables, and egg noodles. Perfect for cold days or when you're feeling under the weather."
            }
        ];
    }
    
    displayRecipes(sampleRecipes);
}

// Show sample data if API key is not configured
if (!API_CONFIG.API_KEY || API_CONFIG.API_KEY === 'YOUR_SPOONACULAR_API_KEY_HERE') {
    // Add a demo button
    const demoBtn = document.createElement('button');
    demoBtn.textContent = 'Try Demo (Sample Data)';
    demoBtn.style.cssText = `
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        margin-left: 15px;
        transition: all 0.3s ease;
    `;
    
    demoBtn.addEventListener('click', showSampleData);
    demoBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 15px rgba(40, 167, 69, 0.4)';
    });
    demoBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
    
    elements.searchBtn.parentNode.appendChild(demoBtn);
}
