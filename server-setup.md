# Server Setup Guide for SmartChef

## The CORS Issue

The error you're experiencing is due to **CORS (Cross-Origin Resource Sharing)** restrictions. When you open the HTML file directly in your browser (using `file://` protocol), browsers block API requests to external domains for security reasons.

## Solutions

### Option 1: Use a Local Server (Recommended)

#### Method 1: Python Server
If you have Python installed:
```bash
# Navigate to your project folder
cd "D:\AI Proj\Recipe Finder"

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

#### Method 2: Node.js Server
If you have Node.js installed:
```bash
# Install a simple server globally
npm install -g http-server

# Navigate to your project folder
cd "D:\AI Proj\Recipe Finder"

# Start the server
http-server -p 8000
```

Then open: `http://localhost:8000`

#### Method 3: Live Server (VS Code Extension)
1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 2: Use the Demo Mode

The app now automatically falls back to demo mode when API calls fail. You'll see:
1. An error message about API connection issues
2. After 2 seconds, demo recipes will appear
3. The demo recipes are relevant to your ingredient search

### Option 3: Browser CORS Extension (Not Recommended for Production)

You can install a CORS extension for your browser, but this is not recommended for security reasons.

## Testing Your API Key

To verify your API key works:

1. **Run the app with a local server** (Option 1)
2. **Enter ingredients** like "chicken, rice"
3. **Click "Get Recipes"**
4. **Check the browser console** (F12) for any error messages

## Expected Behavior

- ✅ **With local server**: Real API calls should work
- ✅ **Without local server**: App shows demo recipes automatically
- ✅ **Invalid API key**: Clear error message
- ✅ **API quota exceeded**: Helpful error message

## Troubleshooting

### Still getting errors?
1. Check your API key is correct in `script.js`
2. Verify you're using a local server (not opening file directly)
3. Check your internet connection
4. Look at browser console (F12) for detailed error messages

### API Key Issues?
1. Go to [Spoonacular API Dashboard](https://spoonacular.com/food-api/console)
2. Check your API key is active
3. Verify you haven't exceeded your daily quota
4. Free tier has limited requests per day

## Quick Test

Try this to test if everything works:
1. Start a local server
2. Enter "chicken" in the search box
3. Click "Get Recipes"
4. You should see real recipe results from Spoonacular API

If you still get errors, the app will automatically show demo recipes instead!
