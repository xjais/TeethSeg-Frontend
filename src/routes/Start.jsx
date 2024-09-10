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

function Start() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const themeContext = useContext(ThemeProviderContext);

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
                style={siderStyle}
                className={
                    themeContext.theme == "dark" ? "darkInfo" : "lightInfo"
                }
                width="15%"
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
