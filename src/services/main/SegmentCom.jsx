import React, { useEffect, useState, useRef } from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Button, Card } from "antd";
import { BlockBlobClient } from "@azure/storage-blob";
import axisoRequest from "@/utils/axios";
import { Bot, Crop, FileAxis3d, Microscope, UploadCloud } from "lucide-react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineFullscreen } from "react-icons/ai";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
import HashLoader from "react-spinners/HashLoader";
import { convertFileToArrayBuffer } from "@/lib/convert-file-to-arraybuffer";
import { getContainerNameSessionStorage } from "@/utils/auth";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkAxesActor from "@kitware/vtk.js/Rendering/Core/AxesActor";
import vtkOrientationMarkerWidget from "@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget";
import vtkScalarBarActor from "@kitware/vtk.js/Rendering/Core/ScalarBarActor";

import ThreeDRenderer from "../../components/ThreeRenderer";
import { FileUploader } from "react-drag-drop-files";

const { Dragger } = Upload;

const SegmentCom = ({ setSegment }) => {
  // const containerName = `upload`; // 容器名称
  const userInfo = window.localStorage.getItem("_authing_user") ? JSON.parse(window.localStorage.getItem("_authing_user")) : {};
  const [containerName, setContainerName] = useState(getContainerNameSessionStorage());
  const fileOBJTypes = ["OBJ"];
  const fileVTPTypes = ["VTP"];
  const [file, setFile] = useState(null);
  const formRef = useRef(null);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [sasTokenUrl, setSasTokenUrl] = useState("");
  const [isPredicted, setIsPredicted] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState();
  const [selectedFile, setSelectedFile] = useState(null);
  const [screenWidth, setScreenWidth] = useState(false);

  // 获取 sas 令牌
  const handleUpload = () => {
    const formData = new FormData();
    if (!fileList && fileList.length === 0) return;
    fileList.forEach((file) => {
      formData.append("files[]", file);
    });
    setUploading(true);
    // return;
    // You can use any AJAX library you like
    const permission = "w"; //write
    const timerange = 5; //minutes
    // 获取sas令牌
    axisoRequest
      .post(`/api/sas?file=输入/${encodeURIComponent(fileList[0].name)}&permission=${permission}&container=${containerName}&timerange=${timerange}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        const { data } = result;
        const { url } = data;
        setSasTokenUrl(url);
        handleFileUpload(url);
      })
      .catch((error) => {
        if (error instanceof Error) {
          message.error(error.message);
        } else {
          setUploadStatus(error);
        }
        setUploading(false);
      });
  };

  // 上传附件
  const handleFileUpload = (sasTokenUrl) => {
    if (sasTokenUrl === "") return;

    convertFileToArrayBuffer(selectedFile)
      .then(async (fileArrayBuffer) => {
        const blockBlobClient = new BlockBlobClient(sasTokenUrl);
        await blockBlobClient.uploadData(fileArrayBuffer);
        setUploading(false);
        return;
      })
      .then(() => {
        setFileList([]);
        setSelectedFile(null);
        setUploading(false);
        message.success("上传成功");
      })
      .catch((error) => {
        if (error instanceof Error) {
          message.error(error.message);
        } else {
          setUploadStatus(error);
        }
        setUploading(false);
      });
  };

  const props = {
    maxCount: 1,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setSelectedFile(file);
      setFileList([file]);
      return false;
    },
    fileList,
  };

  const resizeUpdate = (e) => {
    // 通过事件对象获取浏览器窗口的高度
    let h = e.target.innerWidth;
    if (h <= 675) {
      setScreenWidth(false);
    } else {
      setScreenWidth(true);
    }
  };

  useEffect(() => {
    // 页面刚加载完成后获取浏览器窗口的大小
    let h = window.innerWidth;
    if (h <= 675) {
      setScreenWidth(false);
    } else {
      setScreenWidth(true);
    }

    // 页面变化时获取浏览器窗口的大小
    window.addEventListener("resize", resizeUpdate);

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener("resize", resizeUpdate);
    };
  }, []);

  return (
    <>
      <div className={`w-full h-screen scroll-smooth bg-primary-background "block"}`}>
        <div className="text-center flex-box flex-col">
          <div className="text-primary p-12 text-3xl font-semibold text-center">请选择需要上传的文件</div>
          <div>
            <div className="bg-background text-primary flex-box flex-col md:flex-row w-full px-24 lg:px-96 rounded-md">
              <form ref={formRef} id="upload-form" onSubmit={handleUpload} className="w-full">
                <div className="w-full py-12 flex-box flex-col">
                  <div>
                    <div style={{ margin: "0 auto" }}>
                      {screenWidth ? (
                        <>
                          <Dragger style={{ padding: "20px", margin: "0px 32px", width: "18vw", height: "20vh" }} {...props}>
                            <div style={{ margin: "0px 0px" }}>
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">点击可选择附件</p>
                              <p className="ant-upload-hint">拖拽可选择附件</p>
                            </div>
                          </Dragger>
                        </>
                      ) : (
                        <>
                          <Dragger style={{ padding: "20px", margin: "0px 32px", width: "45vw", height: "20vh" }} {...props}>
                            <div style={{ margin: "0px 0px" }}>
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                              </p>
                              <p className="ant-upload-text">点击可选择附件</p>
                              <p className="ant-upload-hint">拖拽可选择附件</p>
                            </div>
                          </Dragger>
                        </>
                      )}
                    </div>
                  </div>
                  <div stgyle={{ marginTop: "10px" }}></div>
                  <Button
                    type="primary"
                    onClick={handleUpload}
                    disabled={fileList.length === 0}
                    loading={uploading}
                    style={{
                      marginTop: 16,
                    }}
                  >
                    {uploading ? "上传中" : "上传附件"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SegmentCom;
