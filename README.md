# KrishiBandhu

KrishiBandhu is a farm-to-market intelligence platform designed to provide AI-powered price forecasts, market demand insights, and smart selling recommendations to maximize farm profits.

## Project Structure
```text
KrishiBandhu/
├── krishibandhu/            # Next.js Frontend
│   ├── app/                 # Dashboard & Home pages
│   └── public/              # Static assets
└── krishibandhu-backend/    # Express & Python Backend
    ├── data/                # Mock data
    ├── routes/              # API Endpoints
    ├── server.js            # Main Express entry
    └── ml-service.py        # Python ML Prediction Service
```

## Setup Instructions

### 1. Frontend Setup
Navigate into the frontend directory, install dependencies, and run the development server.
```bash
cd krishibandhu
npm install
npm run dev # Runs on port 3000
```

### 2. Backend Setup
Navigate into the backend directory, set up the Node modules, and initialize the Python virtual environment.
```bash
cd krishibandhu-backend
npm install

# Set up Python virtual environment
python -m venv .venv
.venv\Scripts\activate # Windows
# source .venv/bin/activate # Linux/Mac

pip install -r requirements.txt
npm run dev # Runs on port 5000
```

## Features & AI Intelligence
- **Price Forecasting**: ML algorithms (Python/Numpy) process historical Mandi data to predict 7-day future agriculture prices.
- **Smart Recommendations**: Evaluates market volatility to recommend `SELL NOW` or `WAIT`.
- **Demand Heatmaps**: Visual representation of 7-day market demand trends.
- **Farmer Trust Scores**: Logic-based scoring system for marketplace reliability.

## API Documentation

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/prices/:crop` | GET | Returns current price, history, and 7-day forecast for a specific crop. |
| `/api/recommendations/:crop` | GET | Returns actionable AI selling recommendations for a specific crop. |
| `/api/weather/forecast` | GET | Returns 7-day weather forecast for regional agricultural planning. |
| `/api/health` | GET | Backend health check and endpoint listing. |

## Troubleshooting

### Frontend Loads But No Data
- **Backend Check**: Ensure the backend is running on `http://localhost:5000`. You can test with `curl http://localhost:5000/api/health`.
- **Environment Variables**: Verify `NEXT_PUBLIC_API_BASE` in `krishibandhu/.env.local` is set to `http://localhost:5000/api`.

### CORS Errors
- If you see CORS errors in the browser console, ensure `app.use(cors())` is placed **before** all routes in `krishibandhu-backend/server.js`.

### ML Service Errors
- Ensure the Python virtual environment is activated and `numpy` is installed (`pip install -r requirements.txt`).

## Technologies Used
- **Frontend**: Next.js, React, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Python (Numpy, Scikit-learn).
