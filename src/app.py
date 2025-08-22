# app.py
from flask_cors import CORS

FRONTEND_ORIGIN = "https://studious-zebra-v6rxgv4wggjw3xwvw-3000.app.github.dev"

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [FRONTEND_ORIGIN],          # exact frontend origin
            "methods": ["GET", "POST", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    },
    supports_credentials=False  # you’re using Bearer tokens, not cookies
)
