// /src/front/pages/Signup.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { signup as apiSignup } from "../lib/api";

export default function Signup() {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer(); // kept in case you use it elsewhere
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        if (!email || !password) return setErr("Email and password are required.");

        try {
            setBusy(true);
            await apiSignup({ email, password });
            // After signup, go directly to login
            navigate("/login", { replace: true, state: { justSignedUp: true } });
        } catch (e) {
            setErr(e.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: 480 }}>
            <h1 className="mb-3">Create your account</h1>
            <form onSubmit={handleSubmit}>
                <label className="form-label">Email</label>
                <input
                    className="form-control"
                    type="email"
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label className="form-label mt-3">Password</label>
                <input
                    className="form-control"
                    type="password"
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {err && <div className="alert alert-danger mt-3">{err}</div>}
                <button className="btn btn-primary mt-3 w-100" disabled={busy}>
                    {busy ? "Creating..." : "Sign up"}
                </button>
            </form>
            <div className="mt-3">
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </div>
    );
}
