# api/routes.py (additions)
from api.models import db, User, Car  # ⟵ import Car at top


def _validate_car_payload(data):
    # Basic validation; adjust as needed
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


@api.route('/cars', methods=['GET', 'POST'])
def cars_collection():
    _require_auth()  # ensure logged in (you can also scope by user later)
    if request.method == 'GET':
        items = Car.query.order_by(Car.id.desc()).all()
        return jsonify([c.serialize() for c in items]), 200

    # POST
    data = request.get_json() or {}
    color, make, model, year, miles = _validate_car_payload(data)

    car = Car(color=color, make=make, model=model, year=year, miles=miles)
    db.session.add(car)
    db.session.commit()
    return jsonify(car.serialize()), 201


@api.route('/cars/<int:car_id>', methods=['DELETE'])
def cars_delete(car_id):
    _require_auth()
    car = db.session.get(Car, car_id)
    if not car:
        raise APIException("Car not found", status_code=404)
    db.session.delete(car)
    db.session.commit()
    return ("", 204)
