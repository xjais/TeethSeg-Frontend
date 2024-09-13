/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Stage } from "@react-three/drei";

// eslint-disable-next-line react/prop-types
const ThreeDRenderer = ({ file }) => {
  const [objModel, setObjModel] = useState(null);
  const [isPhoneShow, setIsPhoneShow] = useState(false);

  useEffect(() => {
    console.log(file);
    if (file) {
      const loader = new OBJLoader();
      loader.load(URL.createObjectURL(file), (loadedModel) => {
        setObjModel(loadedModel);
      });
    }
  }, [file]);

  const resizeUpdate = (e) => {
    // 通过事件对象获取浏览器窗口的高度
    let h = e.target.innerWidth;
    if (h <= 992) {
      setIsPhoneShow(true);
    } else {
      setIsPhoneShow(false);
    }
  };

  useEffect(() => {
    // 页面刚加载完成后获取浏览器窗口的大小
    let h = window.innerWidth;
    if (h <= 992) {
      setIsPhoneShow(true);
    } else {
      setIsPhoneShow(false);
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
      <Canvas
        dpr={[1, 2]}
        shadowscamera={{ fov: 15 }}
        style={{
          backgroundColor: "transparent", // 透明
          height: "65vh", // 高度
          width: isPhoneShow ? " 85vw" : "55vw",
        }}
        camera={{ position: [0, 10, 10] }}
      >
        <ambientLight intensity={0.5} />
        <OrbitControls maxZoom={1} />
        {/* <Stage environment="city"> */}
        <directionalLight intensity="3" castShadow />
        {objModel && (
          <mesh scale={[0.1, 0.1, 0.1]}>
            <primitive object={objModel}></primitive>
          </mesh>
        )}
        {/* </Stage> */}
      </Canvas>
      {/* 颜色 - 向量 - 位置  directionalLight */}
      {/* 灯光 ambientLight */}
    </>
  );
};

export default ThreeDRenderer;
