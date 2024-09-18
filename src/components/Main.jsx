import "../styles/Main.css";
import { Flex, Spin, Layout, Image } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import VTKViewer from "../services/main/Upload";
import FlagFileInfoMan from "@/contexts/flagFile";
import { useContext, useEffect, useState } from "react";
import ThreeDRenderer from "@/components/ThreeRenderer";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineFullscreen } from "react-icons/ai";
import HashLoader from "react-spinners/HashLoader";
import axios from "axios";

function Main() {
  return (
    <>
      <div className="text-center w-full h-full flex-box flex-col scroll-smooth bg-primary-background lg:px-64 px-12">
        <VTKViewer />
      </div>
    </>
  );
}

export default Main;
