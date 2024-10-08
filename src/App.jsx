import "./styles/App.css";
import { BrowserRouter as Router, Route, Routes, useLocation, createBrowserRouter, Outlet, RouterProvider, Navigate } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import { auth } from "./config/firebase";
import { useEffect, useContext, useState, lazy } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import ChatBot from "./routes/Chatbot";
import { GuardProvider } from "@authing/guard-react18";
import "@authing/guard-react18/dist/esm/guard.min.css";
import Home from "./routes/Home";
import Start from "./routes/Start";
import Docs from "./routes/Docs";
import SignUp from "./routes/SignUp";
import SignIn from "./routes/SignIn";
import Contact from "./routes/Contact";
import OutApp from "./OutApp";
import { getAssToken } from "./utils/auth";
import { QueryClient, QueryClientProvider } from "react-query";
import FlagFileInfoMan from "@/contexts/flagFile";
import SiderFlagMan from "@/contexts/siderFlag";
import AllLoadingMan from "@/contexts/allLoading";
import { ConfigProvider, theme } from "antd";
import { useTheme, ThemeProviderContext } from "@/components/ThemeProvider";
import VisualizeCom from "./services/main/VisualizeCom";
import SegmentCom from "./services/main/SegmentCom";
import ShowFile from "./components/ShowFile";

export const routerApp = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to={"/home"} />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <OutApp />,
    children: [
      {
        path: "/start",
        element: <Start />,
      },
      {
        path: "/visualizeCom",
        element: <VisualizeCom />,
      },
      {
        path: "/segmentCom",
        element: <SegmentCom />,
      },
      {
        path: "/show-file",
        element: <ShowFile />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  const [user, setUser] = useState(getAssToken());
  const [flagFile, setFlagFile] = useState(null);
  const [siderFlag, setSiderFlag] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const { theme } = useContext(ThemeProviderContext);

  return (
    <GuardProvider
      appId="66f6563bc8c862c19e5aa1ad"
      // 如果你使用的是私有化部署的 Authing 服务，需要传入自定义 host，如:
      // host="https://my-authing-app.example.com"
      // 默认情况下，会使用你在 Authing 控制台中配置的第一个回调地址为此次认证使用的回调地址。
      // 如果你配置了多个回调地址，也可以手动指定（此地址也需要加入到应用的「登录回调 URL」中）：
      redirectUri={`${window.location.origin}/sign-in`}
    >
      <ConfigProvider
        theme={{
          // algorithm: theme.defaultAlgorithm,
          token: {
            // colorPrimary: theme === "dark" ? "black" : "white",
            colorPrimary: theme === "dark" ? "black" : "#1677ff",
          },
        }}
      >
        <AllLoadingMan.Provider value={{ allLoading: allLoading, setAllLoading: setAllLoading }}>
          <SiderFlagMan.Provider value={{ siderFlag: siderFlag, setSiderFlag: setSiderFlag }}>
            <FlagFileInfoMan.Provider value={{ flagFile: flagFile, setFlagFile: setFlagFile }}>
              <QueryClientProvider client={queryClient}>
                <RouterProvider router={routerApp} />
              </QueryClientProvider>
            </FlagFileInfoMan.Provider>
          </SiderFlagMan.Provider>
        </AllLoadingMan.Provider>
      </ConfigProvider>
    </GuardProvider>
  );
}

function NavigateToChatbotButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatIconClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-0 right-0 p-10 z-100">
      {/* <div className="flex justify-end fixed bottom-4 right-4">
                <div
                    onClick={handleChatIconClick}
                    style={{ cursor: "pointer" }}
                >
                    {!isChatOpen ? (
                        <MessageSquare className="bg-blue-500 hover:bg-blue-600 rounded-full w-[60px] h-[60px] p-3 text-white border-2 border-white fill-white" />
                    ) : (
                        <X className="bg-blue-500 hover:bg-blue-600 rounded-full w-[60px] h-[60px] p-3 text-white border-2 border-white fill-white" />
                    )}
                </div>
                {isChatOpen && <ChatBot />}
            </div> */}
    </div>
  );
}
export default App;
