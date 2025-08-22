import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export function Navbar() {
	const navigate = useNavigate();
	const { store, dispatch } = useGlobalReducer();
	const loggedIn = !!store.token;

	return (
		<nav className="navbar navbar-light bg-light px-3">
			<Link className="navbar-brand" to="/">Car Fan</Link>
			<div>
				{loggedIn ? (
					<button
						className="btn btn-sm btn-outline-secondary"
						onClick={() => {
							dispatch({ type: "clear_token" });
							navigate("/", { replace: true });
						}}
					>
						Logout
					</button>
				) : (
					<>

					</>
				)}
			</div>
		</nav>
	);
}