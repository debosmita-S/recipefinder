# SmartChef - Recipe Suggestion Web App

A modern, appetizing web application that helps users find delicious recipes based on the ingredients they have in their kitchen. Built with HTML, CSS, and Vanilla JavaScript, featuring integration with the Spoonacular API.

## 🍳 Features

- **Ingredient-based Recipe Search**: Enter ingredients you have and get recipe suggestions
- **Beautiful, Appetizing UI**: Warm colors, gradients, and food-centric design
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Recipe Details Modal**: View detailed recipe information with instructions
- **Loading States**: Smooth loading indicators and transitions
- **Error Handling**: Graceful error handling for API issues
- **Sample Data**: Demo mode with sample recipes when API key is not configured

## 🚀 Quick Start

1. **Clone or Download** this repository
2. **Get a Spoonacular API Key**:
   - Go to [Spoonacular Food API](https://spoonacular.com/food-api)
   - Sign up for a free account
   - Get your API key from the dashboard
3. **Configure the API Key**:
   - Open `script.js`
   - Replace `YOUR_SPOONACULAR_API_KEY_HERE` with your actual API key
4. **Open the App**:
   - Open `index.html` in your web browser
   - Start searching for recipes!

## 📁 Project Structure

```
Recipe Finder/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality and API integration
└── README.md           # This file
```

## 🎨 Design Features

- **Warm Color Palette**: Orange, green, beige, and soft red tones
- **Gradient Backgrounds**: Appetizing food-inspired gradients
- **Card-based Layout**: Clean recipe cards with hover effects
- **Smooth Animations**: Fade-in effects and smooth transitions
- **Mobile-first Design**: Responsive layout for all screen sizes

## 🔧 API Integration

The app uses the Spoonacular API for recipe data:

- **Find by Ingredients**: Searches recipes based on available ingredients
- **Recipe Information**: Fetches detailed recipe data including instructions
- **Error Handling**: Handles API quota limits, invalid keys, and network errors

### API Endpoints Used:
- `GET /recipes/findByIngredients` - Find recipes by ingredients
- `GET /recipes/{id}/information` - Get detailed recipe information

## 🎯 Usage

1. **Enter Ingredients**: Type ingredients you have (e.g., "chicken, rice, tomatoes")
2. **Click Search**: Press "Get Recipes" or hit Enter
3. **Browse Results**: View recipe cards with images, titles, and cooking times
4. **View Details**: Click "View Recipe" to see full recipe information
5. **External Link**: Click the link to view the full recipe on the source website

## 📱 Responsive Design

- **Desktop**: Full grid layout with hover effects
- **Tablet**: Optimized card layout
- **Mobile**: Single column layout with touch-friendly buttons

## 🛠️ Customization

### Colors
Edit the CSS variables in `styles.css` to change the color scheme:
```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #ff8e8e;
    --background-gradient: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
}
```

### API Configuration
Modify the API settings in `script.js`:
```javascript
const API_CONFIG = {
    API_KEY: 'your-api-key-here',
    BASE_URL: 'https://api.spoonacular.com/recipes',
    // ... other settings
};
```

## 🐛 Troubleshooting

### Common Issues:

1. **"API key not configured" error**:
   - Make sure you've replaced the placeholder API key in `script.js`
   - Verify your API key is correct and active

2. **"API quota exceeded" error**:
   - The free Spoonacular plan has daily limits
   - Wait until the next day or upgrade your plan

3. **No recipes found**:
   - Try different ingredient combinations
   - Check spelling of ingredients
   - Use more common ingredient names

4. **Images not loading**:
   - Check your internet connection
   - Some recipe images might be temporarily unavailable

## 🎨 Demo Mode

If you don't have an API key yet, the app includes a demo mode with sample recipes. Click the "Try Demo (Sample Data)" button to see how the app works with sample data.

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this project.

## 📞 Support

If you have any questions or need help setting up the app, please check the troubleshooting section above or create an issue in the repository.

---

**Happy Cooking! 🍳✨**
