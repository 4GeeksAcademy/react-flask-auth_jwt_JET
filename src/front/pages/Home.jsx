// /src/front/pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate();
	const jwt = sessionStorage.getItem("jwt");
	const loggedIn = !!jwt;

	const handleLogout = () => {
		sessionStorage.removeItem("jwt");
		navigate("/", { replace: true });
	};

	return (
		<div className="container py-5" style={{ maxWidth: 720 }}>
			<section className="text-center my-5">
				<img
					src="https://formulamiami.com/wp-content/uploads/2020/05/pista-1-e1589821193615.jpg"
					alt="Hero"
					className="img-fluid mx-auto d-block rounded mb-4"
					style={{ maxHeight: 280, objectFit: "cover", width: "100%" }}
				/>
				<h1 className="display-5 fw-semibold">Welcome</h1>
				<p className="text-muted mt-2">
					Sign in to start adding your dream cars to your private garage.
				</p>
			</section>

			<div className="d-flex justify-content-center gap-2 mt-4">
				{loggedIn ? (
					<>
						<Link className="btn btn-primary" to="/private">
							Go to Private
						</Link>
						<button className="btn btn-outline-danger" onClick={handleLogout}>
							Logout
						</button>
					</>
				) : (
					<>
						<Link className="btn btn-primary" to="/login">
							Login
						</Link>
						<Link className="btn btn-outline-primary" to="/signup">
							Sign up
						</Link>
					</>
				)}
			</div>
		</div>
	);
};
