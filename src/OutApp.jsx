import "./styles/App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  createBrowserRouter,
  Outlet,
  RouterProvider,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import { auth } from "./config/firebase";
import { useEffect, useState, lazy } from "react";
import Header from "./components/Header";
import "./routes/Home.css";
import { useGuard } from "@authing/guard-react18";

function App() {
  const navigate = useNavigate();
  const guard = useGuard();
  useEffect(() => {
    const accessToken = window.localStorage.getItem("_authing_token");
    if (!accessToken) {
      navigate("/sign-in");
    } else {
      console.log("qwe");
    }
    guard.checkLoginStatus().then((user) => {
      // 如果是未登录状态，user 为 undefined
      if (!user) {
        navigate("/sign-in");
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
      console.log("qwe", user);
    });
  }, []);
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
