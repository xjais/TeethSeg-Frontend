import HeaderInfo from "./../components/Header";
import FooterInfo from "./../components/Footer";
import Main from "./../components/Main";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { getAssToken } from "../utils/auth";
import { Flex, Layout, theme } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import TreeInfo from "./Tree";
import { useTheme, ThemeProviderContext } from "@/components/ThemeProvider";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import SiderFlagMan from "@/contexts/siderFlag";
import "./start.css";

function Start() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { siderFlag, setSiderFlag } = useContext(SiderFlagMan);

  const themeContext = useContext(ThemeProviderContext);

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

  const [siderStyle, setSiderStyle] = useState({
    textAlign: "center",
    lineHeight: "150px",
    color: "#fff",
    // backgroundColor:
    //     themeContext.theme == "dark"
    //         ? "#0F1729 !important"
    //         : "#FFFFFF !important",
    // borderTop: "1px solid #CBD5E1",
  });

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    // <div className="flex-box flex-col">
    <Layout style={{ height: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={siderStyle}
        className={`${siderFlag ? "" : "siderLG "}${themeContext.theme == "dark" ? "darkInfo " : "lightInfo "}`}
        width="230px"
      >
        <TreeInfo />
      </Sider>
      <Content>
        <Main />
      </Content>
      {/* <Footer style={footerStyle}>Footer</Footer> */}
      {/* <Footer /> */}
    </Layout>
    // </div>
  );
}

export default Start;
