// /src/front/pages/Login.jsx
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { login as apiLogin } from "../lib/api";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { dispatch } = useGlobalReducer();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");
    const justSignedUp = location.state?.justSignedUp;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            setBusy(true);
            const data = await apiLogin({ email, password }); // { token, user }
            const jwt = data?.token || "";
            dispatch({ type: "set_jwt", payload: { jwt, user: data?.user } });
            navigate("/private", { replace: true });
        } catch (e) {
            setErr(e.message);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: 480 }}>
            <h1 className="mb-3">Log in</h1>
            {justSignedUp && (
                <div className="alert alert-success">Account created. Please log in.</div>
            )}
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
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {err && <div className="alert alert-danger mt-3">{err}</div>}
                <button className="btn btn-primary mt-3 w-100" disabled={busy}>
                    {busy ? "Signing in..." : "Log in"}
                </button>
            </form>
            <div className="mt-3">
                No account? <Link to="/signup">Create one</Link>
            </div>
        </div>
    );
}
