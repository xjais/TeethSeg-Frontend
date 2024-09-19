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
import { Layout, theme } from "antd";
import { auth } from "./config/firebase";
import { useEffect, useState, lazy, useContext } from "react";
import HeaderInfo from "./components/Header";
import "./routes/Home.css";
import { useGuard } from "@authing/guard-react18";
import SiderFlagMan from "@/contexts/siderFlag";
import { AiOutlineArrowLeft, AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { useTheme, ThemeProviderContext } from "@/components/ThemeProvider";
import TreeInfo from "./routes/Tree";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const guard = useGuard();
  const themeContext = useContext(ThemeProviderContext);
  const { Header, Footer, Sider, Content } = Layout;
  const [collapsedBreak, setCollapsedBreak] = useState(false);
  const { siderFlag, setSiderFlag } = useContext(SiderFlagMan);
  const [fullScreen, setFullScreen] = useState(false);
  const [siderStyle, setSiderStyle] = useState({
    textAlign: "center",
    lineHeight: "150px",
    color: "#fff",
  });

  useEffect(() => {
    const accessToken = window.localStorage.getItem("_authing_token");
    if (!accessToken) {
      navigate("/sign-in");
    } else {
      console.log("qwe");
    }
    guard
      .checkLoginStatus()
      .then((user) => {
        // 如果是未登录状态，user 为 undefined
        if (!user) {
          navigate("/sign-in");
          window.localStorage.clear();
          window.sessionStorage.clear();
        }
      })
      .catch((error) => {
        navigate("/sign-in");
        window.localStorage.clear();
        window.sessionStorage.clear();
      });
  }, []);

  const resizeUpdate = (e) => {
    // 通过事件对象获取浏览器窗口的高度
    let h = e.target.innerWidth;
    if (h <= 992) {
      setSiderFlag(false);
    } else {
      setSiderFlag(true);
    }
  };

  useEffect(() => {
    // 页面刚加载完成后获取浏览器窗口的大小
    let h = window.innerWidth;
    if (h <= 992) {
      setSiderFlag(false);
    } else {
      setSiderFlag(true);
    }

    // 页面变化时获取浏览器窗口的大小
    window.addEventListener("resize", resizeUpdate);

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener("resize", resizeUpdate);
    };
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 返回
  const handleBackBtn = () => {
    navigate("/start");
  };

  // 全屏
  const handleResizeWindow = () => {
    const headerElement = document.querySelector(".header");
    const footerElement = document.querySelector(".footer");

    setFullScreen(!fullScreen);

    if (!fullScreen) {
      if (headerElement) {
        headerElement.style.display = "none";
      }
      if (footerElement) {
        footerElement.style.display = "none";
      }
    } else {
      if (headerElement) {
        headerElement.style.display = "block";
      }
      if (footerElement) {
        footerElement.style.display = "block";
      }
    }
  };

  return (
    <>
      <HeaderInfo style={{ zIndex: 10 }} />
      <Layout className="layoutStyle">
        <Sider
          collapsed={collapsedBreak}
          breakpoint="lg"
          onCollapse={(collapsed) => {
            setCollapsedBreak(collapsed);
          }}
          collapsedWidth="0"
          style={siderStyle}
          className={`${siderFlag ? "" : "siderLG "}${themeContext.theme == "dark" ? "darkInfo " : "lightInfo "}`}
          width="230px"
        >
          <TreeInfo />
        </Sider>
        <Content>
          <div
            className={`p-3 flex justify-center md:justify-between max-h-20 space-x-2 sm:space-x-4 
              ${location.pathname === "/start" ? "flex-row-reverse" : ""}
               ${themeContext.theme === "dark" ? "headerBackgroundDark" : "headerBackgroundLight"}`}
          >
            {location.pathname !== "/start" && (
              <button
                className="bg-slate-100 font-semibold text-slate-800 py-4 px-2 md:px-4 hover:bg-slate-600 hover:text-white rounded-lg transition ease-linear"
                onClick={handleBackBtn}
              >
                <div className="flex items-center">
                  <AiOutlineArrowLeft className="mx-2" />
                  <span className="hidden sm:block">返回</span>
                </div>
              </button>
            )}
            <button
              style={{ height: location.pathname === "/start" ? "53px" : "" }}
              className="bg-slate-100 font-semibold text-slate-800 py-2 px-4 hover:bg-slate-600 hover:text-white rounded-lg transition ease-linear"
              onClick={handleResizeWindow}
            >
              {fullScreen ? (
                <div className="flex items-center font-semibold">
                  <span className="mx-2 hidden sm:block whitespace-nowrap">退出全屏</span> <AiOutlineFullscreenExit size={20} />
                </div>
              ) : (
                <div className="flex items-center font-semibold">
                  <span className="mx-2  hidden sm:block whitespace-nowrap">打开全屏</span> <AiOutlineFullscreen size={20} />
                </div>
              )}
            </button>
          </div>
          <Outlet />
        </Content>
      </Layout>
    </>
  );
}

export default App;
