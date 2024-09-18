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
import { AiOutlineArrowLeft, AiOutlineFullscreen } from "react-icons/ai";
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";
import SiderFlagMan from "@/contexts/siderFlag";

function Start() {
  const navigate = useNavigate();
  return <Main />;
}

export default Start;
