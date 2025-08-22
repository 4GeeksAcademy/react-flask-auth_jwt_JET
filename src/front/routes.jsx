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
  const jwt = sessionStorage.getItem("jwt");
  if (!jwt) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="single/:theId" element={<Single />} />
      <Route path="demo" element={<Demo />} />

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

      <Route path="*" element={<h1>Not found!</h1>} />
    </Route>
  )
);
