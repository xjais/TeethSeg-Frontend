import { Contact, FileText, Home, Info, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { cn } from "@/lib/utils";
import { getAssToken } from "@/utils/auth";

function MenuItems() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = window.localStorage.getItem("_authing_token");
        if (token) {
            setUser(token);
        } else {
            setUser(null);
        }
    }, []);

    return (
        <div className="flex p-5 sm:flex-row flex-col">
            <div
                onClick={() => navigate("/home")}
                className={cn(
                    "menu-item",
                    location.pathname === "/home"
                        ? "bg-foreground text-background hover:bg-foreground hover:text-background font-semibold"
                        : "hover:bg-foreground hover:text-background  bg-background text-foreground"
                )}
            >
                <Home />
                <span className="px-2">首页</span>
            </div>
            {/* <div
                onClick={() => navigate("/docs")}
                className={cn(
                    "menu-item",
                    location.pathname === "/docs"
                        ? "bg-foreground text-background font-semibold hover:bg-foreground hover:text-background"
                        : "hover:bg-foreground hover:text-background  bg-background text-foreground"
                )}
            >
                <FileText />
                <span className="px-2">Docs</span>
            </div> */}
            {user ? (
                <div
                    onClick={() => navigate("/start")}
                    className={cn(
                        "menu-item",
                        location.pathname === "/start"
                            ? "bg-foreground text-background hover:bg-foreground hover:text-background font-semibold"
                            : "hover:bg-foreground hover:text-background  bg-background text-foreground"
                    )}
                >
                    <Play />
                    <span className="px-2">开始</span>
                </div>
            ) : (
                <></>
            )}

            {/* <div
                onClick={() => navigate("/about")}
                className={cn(
                    "menu-item",
                    location.pathname === "/about"
                        ? "bg-foreground text-background hover:bg-foreground hover:text-background font-semibold"
                        : "hover:bg-foreground hover:text-background  bg-background text-foreground"
                )}
            >
                <Info />
                <span className="px-2">About</span>
            </div> */}
            {/* <div
                onClick={() => navigate("/contact")}
                className={cn(
                    "menu-item",
                    location.pathname === "/contact"
                        ? "bg-foreground text-background hover:bg-foreground hover:text-background font-semibold"
                        : "hover:bg-foreground hover:text-background  bg-background text-foreground"
                )}
            >
                <Contact />
                <span className="px-2">Contact</span>
            </div> */}
        </div>
    );
}

export default MenuItems;
