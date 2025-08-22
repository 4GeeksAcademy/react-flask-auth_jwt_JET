// /src/front/pages/Private.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCars, addCar, deleteCar, API_BASE } from "../lib/api";

export default function Private() {
    const navigate = useNavigate();
    const jwt = sessionStorage.getItem("jwt");

    const [cars, setCars] = useState([]);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    const [color, setColor] = useState("");
    const [make, setMake] = useState("");
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [miles, setMiles] = useState("");

    useEffect(() => {
        if (!jwt) {
            navigate("/login", { replace: true });
            return;
        }
        (async () => {
            try {
                const list = await getCars(jwt);
                setCars(list);
            } catch (e) {
                console.error("Load cars failed:", e);
                if (e?.status === 401) {
                    sessionStorage.removeItem("jwt");
                    navigate("/login", { replace: true });
                } else {
                    setErr(e?.message || "Could not load your cars. Please try again.");
                }
            }
        })();
    }, [jwt, navigate]);

    const resetForm = () => {
        setColor(""); setMake(""); setModel(""); setYear(""); setMiles("");
    };

    const onAdd = async (e) => {
        e.preventDefault();
        setErr("");
        if (!jwt) return navigate("/login", { replace: true });

        if (!color || !make || !model || !year || !miles) {
            setErr("Please fill out all fields.");
            return;
        }
        const yearNum = parseInt(year, 10);
        const milesNum = parseInt(miles, 10);
        if (Number.isNaN(yearNum) || yearNum < 1886 || yearNum > 2100) {
            setErr("Year must be a number between 1886 and 2100.");
            return;
        }
        if (Number.isNaN(milesNum) || milesNum < 0) {
            setErr("Miles must be a number >= 0.");
            return;
        }

        try {
            setBusy(true);
            const created = await addCar(
                { color, make, model, year: yearNum, miles: milesNum },
                jwt
            );
            setCars((prev) => [created, ...prev]);
            resetForm();
        } catch (e) {
            if (e?.status === 401) {
                sessionStorage.removeItem("jwt");
                navigate("/login", { replace: true });
            } else {
                setErr(e?.message || "Failed to add car.");
            }
        } finally {
            setBusy(false);
        }
    };

    const onDelete = async (id) => {
        try {
            await deleteCar(id, jwt);
            setCars((prev) => prev.filter((c) => c.id !== id));
        } catch (e) {
            if (e?.status === 401) {
                sessionStorage.removeItem("jwt");
                navigate("/login", { replace: true });
            } else {
                alert(e?.message || "Failed to delete");
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("jwt");
        navigate("/", { replace: true });
    };

    return (
        <div className="container py-4" style={{ maxWidth: 900 }}>
            <h1 className="mb-3">Here is where you can add you dream car</h1>

            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={onAdd}>
                        <div className="row g-3">
                            <div className="col-12 col-md-4">
                                <label className="form-label">Color</label>
                                <input className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Make</label>
                                <input className="form-control" value={make} onChange={(e) => setMake(e.target.value)} />
                            </div>
                            <div className="col-12 col-md-4">
                                <label className="form-label">Model</label>
                                <input className="form-control" value={model} onChange={(e) => setModel(e.target.value)} />
                            </div>
                            <div className="col-12 col-md-3">
                                <label className="form-label">Year</label>
                                <input className="form-control" value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" />
                            </div>
                            <div className="col-12 col-md-3">
                                <label className="form-label">Miles</label>
                                <input className="form-control" value={miles} onChange={(e) => setMiles(e.target.value)} inputMode="numeric" />
                            </div>
                            <div className="col-12 col-md-6 d-flex align-items-end justify-content-end">
                                <button className="btn btn-primary" type="submit" disabled={busy}>
                                    {busy ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </div>
                        {err && <div className="alert alert-danger mt-3 mb-0">{err}</div>}
                    </form>
                </div>
            </div>

            <div className="row g-3">
                {cars.length === 0 && (
                    <div className="col-12">
                        <div className="alert alert-secondary">No cars yet. Add your first dream car above.</div>
                    </div>
                )}
                {cars.map((c) => (
                    <div className="col-12 col-md-6 col-lg-4" key={c.id}>
                        <div className="card h-100">
                            <div className="card-body">
                                <h5 className="card-title mb-1">{c.year} {c.make} {c.model}</h5>
                                <div className="text-muted mb-2">Color: {c.color}</div>
                                <div className="fw-light">Miles: {c.miles?.toLocaleString?.() ?? c.miles}</div>
                            </div>
                            <div className="card-footer d-flex justify-content-end gap-2">
                                <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(c.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4">
                <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
                <span className="ms-3 text-muted">API: {API_BASE}</span>
            </div>
        </div>
    );
}
