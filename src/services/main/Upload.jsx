import React, { useEffect, useState, useRef } from "react";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { message, Upload, Button, Card } from "antd";
import { BlockBlobClient } from "@azure/storage-blob";
import axisoRequest from "@/utils/axios";
import { Bot, Crop, FileAxis3d, Microscope, UploadCloud } from "lucide-react";
import "@kitware/vtk.js/Rendering/Profiles/Geometry";
import SegmentCom from "./SegmentCom";
import VisualizeCom from "./VisualizeCom";
import { useNavigate } from "react-router-dom";

const { Dragger } = Upload;

const App = () => {
  const navigate = useNavigate();
  const userInfo = window.localStorage.getItem("_authing_user") ? JSON.parse(window.localStorage.getItem("_authing_user")) : {};
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isPredicted, setIsPredicted] = useState(false);
  const [segment, setSegment] = useState(false);
  const [visualize, setVisualize] = useState(false);

  const handleVisualizeBtn = () => {
    navigate("/visualizeCom");
  };

  const handleSegmentBtn = () => {
    navigate("/segmentCom");
  };

  return (
    <>
      {/* 原始 */}
      <div
        className={`w-full h-screen scroll-smooth bg-primary-background mt-4 ${
          !uploading &&
          !isPredicted &&
          // !file &&
          !segment &&
          !visualize
            ? "block"
            : "hidden"
        }`}
      >
        <div className="text-center flex-box flex-col">
          <div className="text-primary p-12 text-3xl font-semibold text-center">请选择文件上传</div>
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
    </>
  );
};
export default App;
