// /src/front/routes.jsx
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Navigate,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Private from "./pages/Private";

function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Make Home the index route */}
      <Route index element={<Home />} />

      {/* Your existing routes */}
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />

      {/* Add these so they actually match */}
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route
        path="private"
        element={
          <ProtectedRoute>
            <Private />
          </ProtectedRoute>
        }
      />

      {/* Proper 404 as a wildcard, not via errorElement */}
      <Route path="*" element={<h1>Not found!</h1>} />
    </Route>
  )
);
