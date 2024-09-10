import React, { useEffect, useState, useRef } from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Button, Card } from "antd";
import { BlockBlobClient } from '@azure/storage-blob';
import axisoRequest from "@/utils/axios";
import { Bot, Crop, FileAxis3d, Microscope, UploadCloud } from "lucide-react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineFullscreen } from "react-icons/ai";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { FaDownload } from "react-icons/fa";
import HashLoader from "react-spinners/HashLoader";

import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import vtkFullScreenRenderWindow from "@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow";
import vtkXMLPolyDataReader from "@kitware/vtk.js/IO/XML/XMLPolyDataReader";
import vtkColorTransferFunction from "@kitware/vtk.js/Rendering/Core/ColorTransferFunction";
import vtkMapper from "@kitware/vtk.js/Rendering/Core/Mapper";
import vtkActor from "@kitware/vtk.js/Rendering/Core/Actor";
import vtkAxesActor from "@kitware/vtk.js/Rendering/Core/AxesActor";
import vtkOrientationMarkerWidget from "@kitware/vtk.js/Interaction/Widgets/OrientationMarkerWidget";
import vtkScalarBarActor from "@kitware/vtk.js/Rendering/Core/ScalarBarActor";

import ThreeDRenderer from "./../../components/ThreeRenderer";
import { FileUploader } from "react-drag-drop-files";
import SegmentCom from './SegmentCom';
import VisualizeCom from './VisualizeCom';

const { Dragger } = Upload;

const App = () => {
    // const containerName = `upload`; // 容器名称
    const userInfo = window.localStorage.getItem('_authing_user') ? JSON.parse(window.localStorage.getItem('_authing_user')) : {}
    const [containerName, setContainerName] = useState(userInfo.username);
    const formRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [sasTokenUrl, setSasTokenUrl] = useState('');
    const [isPredicted, setIsPredicted] = useState(false);
    const [segment, setSegment] = useState(false);
    const [visualize, setVisualize] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);

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

    const handleVisualizeBtn = () => {
        setVisualize(true);
    };

    const handleSegmentBtn = () => {
        setSegment(true);
    };

    return (
        <>
            {/* 原始 */}
            <div
                className={`w-full h-screen scroll-smooth bg-primary-background mt-4 ${!uploading &&
                    !isPredicted
                    &&
                    // !file &&
                    !segment &&
                    !visualize
                    ? "block"
                    : "hidden"
                    }`}
            >
                <div className="p-3 m-4 flex justify-end h-20">
                    <button
                        className="bg-slate-100 font-semibold text-slate-800 py-2 px-4 hover:bg-slate-600 hover:text-white rounded-lg transition ease-linear"
                        onClick={handleResizeWindow}
                    >
                        {fullScreen ? (
                            <div className="flex items-center font-semibold">
                                <span className="mx-2">退出全屏</span>{" "}
                                <AiOutlineFullscreenExit size={20} />
                            </div>
                        ) : (
                            <div className="flex items-center font-semibold">
                                <span className="mx-2">打开全屏</span>{" "}
                                <AiOutlineFullscreen size={20} />
                            </div>
                        )}
                    </button>
                </div>
                <div className="text-center flex-box flex-col">
                    <div className="text-primary p-12 text-3xl font-semibold text-center">
                        请选择文件上传
                    </div>
                    <div>
                        <div className="bg-background flex-box flex-col md:flex-row w-full px-24 py-32 lg:px-96 rounded-md">
                            <div className="text-center flex-box flex-col md:flex-row gap-4 w-full">
                                <button
                                    onClick={handleVisualizeBtn}
                                    className="bg-slate-100 font-semibold text-slate-800 py-4 px-8 hover:bg-slate-700 hover:text-white leading-tight rounded-lg transition ease-linear"
                                >
                                    <div className="flex items-center whitespace-nowrap">
                                        <Microscope className="mx-2" />
                                        图片
                                    </div>
                                </button>
                                <button
                                    onClick={handleSegmentBtn}
                                    className="bg-slate-100 font-semibold text-slate-800 py-4 px-8 hover:bg-slate-700 hover:text-white leading-tight rounded-lg transition ease-linear"
                                >
                                    <div className="flex items-center whitespace-nowrap">
                                        <Crop className="mx-2" />
                                        其余附件
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 图片 */}
            {
                visualize ? <>
                    <VisualizeCom setVisualize={setVisualize} />
                </> : <></>
            }
            {/* 其余 */}
            {
                segment ? <>
                    <SegmentCom setSegment={setSegment} />
                </> : <></>
            }
        </>
    );
};
export default App;
