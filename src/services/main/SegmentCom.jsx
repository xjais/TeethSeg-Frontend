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
import { convertFileToArrayBuffer } from '@/lib/convert-file-to-arraybuffer';

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
    const userInfo = window.localStorage.getItem('_authing_user') ? JSON.parse(window.localStorage.getItem('_authing_user')) : {}
    const [containerName, setContainerName] = useState(userInfo.username === "xiaojun" ? userInfo.username : userInfo.id);
    const fileOBJTypes = ["OBJ"];
    const fileVTPTypes = ["VTP"];
    const [file, setFile] = useState(null);
    const formRef = useRef(null);
    const [fileList, setFileList] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [sasTokenUrl, setSasTokenUrl] = useState('');
    const [isPredicted, setIsPredicted] = useState(false);
    const [fullScreen, setFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState();
    const [selectedFile, setSelectedFile] = useState(null);

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

    // 获取 sas 令牌
    const handleUpload = () => {
        const formData = new FormData();
        if (!fileList && fileList.length === 0) return;
        fileList.forEach((file) => {
            formData.append('files[]', file);
        });
        setUploading(true);
        // return;
        // You can use any AJAX library you like
        const permission = 'w'; //write
        const timerange = 5; //minutes
        // 获取sas令牌
        axisoRequest
            .post(
                `/api/sas?file=${encodeURIComponent(
                    fileList[0].name
                )}&permission=${permission}&container=${containerName}&timerange=${timerange}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then((result) => {
                const { data } = result;
                const { url } = data;
                setSasTokenUrl(url);
                handleFileUpload(url);
            })
            .catch((error) => {
                if (error instanceof Error) {
                    const { message, stack } = error;
                    setSasTokenUrl(`Error getting sas token: ${message} ${stack || ''}`);
                } else {
                    setUploadStatus(error);
                }
                setUploading(false);
            });
    };

    // 上传附件
    const handleFileUpload = (sasTokenUrl) => {
        if (sasTokenUrl === '') return;

        convertFileToArrayBuffer(selectedFile)
            .then((fileArrayBuffer) => {
                const blockBlobClient = new BlockBlobClient(sasTokenUrl);
                blockBlobClient.uploadData(fileArrayBuffer);
                setUploading(false);
                return
            })
            .then(() => {
                setFileList([]);
                setSelectedFile(null);
                setUploading(false);
                message.success('上传成功')
            })
            .catch((error) => {
                if (error instanceof Error) {
                    const { message, stack } = error;
                    setUploadStatus(
                        `Failed to finish upload with error : ${message} ${stack || ''}`
                    );
                } else {
                    setUploadStatus(error);
                }
                setUploading(false);
            });
    };

    // 选择附件
    const handleFileChange = (file) => {
        setFileList(prev => ([...prev, ...file]))
    }

    const props = {
        maxCount: 1,
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setSelectedFile(file)
            setFileList([file]);
            return false;
        },
        fileList,
    };

    // 返回
    const handleBackBtn = () => {
        setSegment(false)
    }

    const style = (
        <div className="container border-2 border-primary/50 bg-background text-primary hover:bg-primary/10 transition ease-linear rounded-xl px-8 py-6 lg:mx-8 md:px-24 cursor-pointer flex-box flex-col">
            <div className="flex-box box-1">
                <div className="w-12 h-12 mx-auto ">
                    <UploadCloud size={32} strokeWidth={2.5} />
                </div>
            </div>
            <div className="flex-box box-2">
                <p className="font-medium 0">Upload or Drag and Drop a File</p>
            </div>
        </div>
    );
    return (
        <>
            <div
                className={`w-full h-screen scroll-smooth bg-primary-background mt-4 "block"
                    }`}
            >
                <div className="p-3 m-4 flex justify-center md:justify-between max-h-20 space-x-2 sm:space-x-4">
                    <button
                        className="bg-slate-100 font-semibold text-slate-800 py-4 px-2 md:px-4 hover:bg-slate-600 hover:text-white rounded-lg transition ease-linear"
                        onClick={handleBackBtn}
                    >
                        <div className="flex items-center">
                            <AiOutlineArrowLeft className="mx-2" />
                            <span className="hidden sm:block">返回</span>
                        </div>
                    </button>
                    <button
                        className="bg-slate-100 font-semibold text-slate-800 py-2 px-4 hover:bg-slate-600 hover:text-white rounded-lg transition ease-linear"
                        onClick={handleResizeWindow}
                    >
                        {fullScreen ? (
                            <div className="flex items-center font-semibold">
                                <span className="mx-2 hidden sm:block whitespace-nowrap">
                                    退出全屏
                                </span>{" "}
                                <AiOutlineFullscreenExit size={20} />
                            </div>
                        ) : (
                            <div className="flex items-center font-semibold">
                                <span className="mx-2  hidden sm:block whitespace-nowrap">
                                    打开全屏
                                </span>{" "}
                                <AiOutlineFullscreen size={20} />
                            </div>
                        )}
                    </button>
                </div>
                <div className="text-center flex-box flex-col">
                    <div className="text-primary p-12 text-3xl font-semibold text-center">
                        请选择需要上传的文件
                    </div>
                    <div>
                        <div className="bg-background text-primary flex-box flex-col md:flex-row w-full px-24 lg:px-96 rounded-md">
                            <form
                                ref={formRef}
                                id="upload-form"
                                onSubmit={handleUpload}
                                className="w-full"
                            >
                                <div className="w-full py-12 flex-box flex-col">
                                    <div>
                                        <div style={{ margin: '0 auto', }}>
                                            <Dragger style={{ padding: '20px', margin: '0px 32px', width: '18vw', height: '20vh' }} {...props}>
                                                <div style={{ margin: '0px 0px', }}>
                                                    <p className="ant-upload-drag-icon">
                                                        <InboxOutlined />
                                                    </p>
                                                    <p className="ant-upload-text">点击可选择附件</p>
                                                    <p className="ant-upload-hint">拖拽可选择附件</p>
                                                </div>
                                            </Dragger>
                                        </div>
                                    </div>
                                    <div stgyle={{ marginTop: '10px' }}></div>
                                    <Button
                                        type="primary"
                                        onClick={handleUpload}
                                        disabled={fileList.length === 0}
                                        loading={uploading}
                                        style={{
                                            marginTop: 16,
                                        }}
                                    >
                                        {uploading ? '上传中' : '上传附件'}
                                    </Button>
                                    {/* <div>
                                        <div className="text-center text-md py-3">
                                            只能上传图片格式
                                        </div>
                                    </div> */}
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
