# src/api/routes.py
from flask import request, jsonify, Blueprint
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from api.models import db, User, Car
from api.utils import APIException, hash_password, verify_password

api = Blueprint('api', __name__)


@api.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# ---- Public sample ----


@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({"message": "Hello from the API"}), 200

# ---- Signup ----


@api.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        raise APIException("Email and password are required", status_code=400)
    if "@" not in email or "." not in email.split("@")[-1]:
        raise APIException("Invalid email format", status_code=400)
    if User.query.filter_by(email=email).first():
        raise APIException("Email already registered", status_code=409)

    user = User(email=email, password=hash_password(password), is_active=True)
    db.session.add(user)
    db.session.commit()

    # Redirecting to login after signup on the frontend; we don't need to return a token here.
    return jsonify({"message": "User created", "user": {"id": user.id, "email": user.email}}), 201

# ---- Login -> return JWT ----


@api.route('/token', methods=['POST'])
def token():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    if not email or not password:
        raise APIException("Email and password are required", status_code=400)

    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(user.password, password):
        raise APIException("Invalid credentials", status_code=401)

    # identity is typically the user id
    access_token = create_access_token(identity=user.id)
    # Keep the same key name "token" so the frontend doesn't change
    return jsonify({"token": access_token, "user": {"id": user.id, "email": user.email}}), 200

# ---- Logout (stateless) ----


@api.route('/logout', methods=['POST'])
def logout():
    return ("", 204)

# ------------- PRIVATE DATA (Cars under /api/private) -------------


def _validate_car_payload(data):
    color = (data.get("color") or "").strip()
    make = (data.get("make") or "").strip()
    model = (data.get("model") or "").strip()
    try:
        year = int(data.get("year", 0))
    except Exception:
        year = 0
    try:
        miles = int(data.get("miles", -1))
    except Exception:
        miles = -1

    if not all([color, make, model]):
        raise APIException(
            "color, make, and model are required", status_code=400)
    if not (1886 <= year <= 2100):
        raise APIException(
            "year must be between 1886 and 2100", status_code=400)
    if miles < 0:
        raise APIException("miles must be >= 0", status_code=400)
    return color, make, model, year, miles

# GET=list cars, POST=create car


@api.route('/private', methods=['GET', 'POST'])
@jwt_required()
def private_collection():
    # If later you want per-user cars, use user_id = get_jwt_identity()
    if request.method == 'GET':
        items = Car.query.order_by(Car.id.desc()).all()
        return jsonify([c.serialize() for c in items]), 200

    data = request.get_json() or {}
    color, make, model, year, miles = _validate_car_payload(data)
    car = Car(color=color, make=make, model=model, year=year, miles=miles)
    db.session.add(car)
    db.session.commit()
    return jsonify(car.serialize()), 201

# DELETE a specific car


@api.route('/private/<int:car_id>', methods=['DELETE'])
@jwt_required()
def private_delete(car_id):
    car = db.session.get(Car, car_id)
    if not car:
        raise APIException("Car not found", status_code=404)
    db.session.delete(car)
    db.session.commit()
    return ("", 204)
