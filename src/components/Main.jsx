import "../styles/Main.css";
import { Flex, Layout, Image } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import VTKViewer from "../services/main/Upload";
import FlagFileInfoMan from "@/contexts/flagFile";
import { useContext, useEffect, useState } from "react";
import ThreeDRenderer from "@/components/ThreeRenderer";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineFullscreen } from "react-icons/ai";
import axios from "axios";

function Main() {
  const { flagFile, setFlagFile } = useContext(FlagFileInfoMan);
  const [fileNameFlag, setFileNameFlag] = useState(false);
  const [fileBlob, setFileBlob] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (!flagFile) return;
    const fileNameList = flagFile.split(".");
    const index = fileNameList[fileNameList.length - 1];
    if (index === "png" || index === "jpg" || index === "jpeg") {
      setFileNameFlag(true);
    } else {
      axios
        .get(`${flagFile}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
          const itemSplit = flagFile.split("/");
          const name = itemSplit[itemSplit.length - 1];
          const blobInfo = blobToFile(res.data, name);
          setFileBlob(blobInfo);
        });
      setFileNameFlag(false);
    }
  }, [flagFile]);

  function blobToFile(blob, filename, type) {
    return new File([blob], filename, { type });
  }

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

  // 返回
  const handleBackBtn = () => {
    setFlagFile(null);
  };

  return (
    <>
      <div className="text-center w-full h-full flex-box flex-col scroll-smooth bg-primary-background lg:px-64 px-12">
        {flagFile ? (
          <>
            {fileNameFlag ? (
              <>
                <div
                  style={{ position: "absolute", top: "10%" }}
                  className="p-3 m-4 flex justify-center md:justify-between max-h-20 space-x-2 sm:space-x-4"
                >
                  <button
                    className="bg-slate-100 font-semibold text-slate-800 py-4 px-2 md:px-4 hover:bg-slate-600 hover:text-white rounded-lg transition ease-linear"
                    onClick={handleBackBtn}
                  >
                    <div className="flex items-center">
                      <AiOutlineArrowLeft className="mx-2" />
                      <span className="hidden sm:block">关闭</span>
                    </div>
                  </button>
                </div>
                <Image
                  // width={'24vw'}
                  style={{ maxHeight: "700px", maxWidth: "100%" }}
                  src={flagFile}
                />
              </>
            ) : (
              <>
                <div className="text-center flex-box flex-col">
                  {/* <ThreeDRenderer file={fileBlob} /> */}
                </div>
              </>
            )}
          </>
        ) : (
          <>
            <VTKViewer />
          </>
        )}
      </div>
    </>
  );
}

export default Main;
