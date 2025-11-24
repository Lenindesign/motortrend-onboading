# Quick Start: Real Car Listings

## 🚀 Get Real Listings in 3 Steps

### Step 1: Get Your Free API Key
1. Go to: **https://www.marketcheck.com/automotive/api**
2. Click "Sign Up" or "Get API Key"
3. Copy your API key

### Step 2: Add API Key to Your Project
Create a file named `.env` in your project root:

```
VITE_MARKETCHECK_API_KEY=paste_your_key_here
```

### Step 3: Restart Your Dev Server
```bash
npm run dev
```

## ✅ That's It!

Your LocalListingsSidebar will now show **REAL car listings** with:
- ✅ Actual dealer inventory
- ✅ Real pricing
- ✅ Dealer locations
- ✅ Vehicle details (VIN, mileage, trim, colors)

## 📝 Without API Key?

**No problem!** The app automatically uses realistic mock data if:
- No API key is configured
- API limit is reached (100/day)
- API is unavailable

## 🔍 How to Verify It's Working

Check your browser console:
- `✅ Using real listings from Marketcheck API` = **Real data!**
- `📝 Using mock listings data` = **Mock data**

## 💡 Free Tier Limits

- **100 requests per day** (resets at midnight UTC)
- Built-in 5-minute caching reduces API calls
- Automatic fallback when limit reached

---

**Need help?** See `MARKETCHECK_API_SETUP.md` for detailed documentation.


