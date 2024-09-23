import Features from "../components/Features";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Faq from "../components/FAQ";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import * as dayjs from "dayjs";
import "./Home.css";
import { Carousel } from "antd";

function Home() {
  const CarouselRef = useRef();
  const [screenWidth, setScreenWidth] = useState(false);
  const [imgHeight, setImgHeight] = useState(978);

  const resizeUpdate = (e) => {
    // 通过事件对象获取浏览器窗口的高度
    let h = e.target.innerWidth;
    if (h <= 992) {
      setScreenWidth(false);
    } else {
      setScreenWidth(true);
    }
    getImgHeight();
  };

  const getImgHeight = () => {
    const headerHeight = document.querySelector(".headerSticky");
    const headerRow = document.querySelector(".headerRow");
    const heightVH = getWindowHeight();
    // 兼容IE和火狐谷歌等的写法;
    let marginHeight;
    if (window.getComputedStyle) {
      marginHeight = window.getComputedStyle(headerRow, null);
    } else {
      marginHeight = div.currentStyle; //兼容IE的写法
    }
    const margin = Number(marginHeight.marginTop.split("px")[0]) + Number(marginHeight.marginBottom.split("px")[0]);
    console.log(margin);
    setImgHeight(heightVH - (headerHeight.clientHeight + margin));
    console.log(heightVH - (headerHeight.clientHeight + margin));
  };

  function getWindowHeight() {
    var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return windowHeight;
  }

  useEffect(() => {
    // 页面刚加载完成后获取浏览器窗口的大小
    let h = window.innerWidth;
    if (h <= 992) {
      setScreenWidth(false);
    } else {
      setScreenWidth(true);
    }
    // 获取img高度
    getImgHeight();

    // 页面变化时获取浏览器窗口的大小
    window.addEventListener("resize", resizeUpdate);

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener("resize", resizeUpdate);
    };
  }, []);

  useEffect(() => {
    // 兼容谷歌
    window.addEventListener("wheel", handleMouseScroll);
    // 兼容ie
    window.addEventListener("mousewheel", handleMouseScroll);
    //    兼容火狐非标准事件
    window.addEventListener("DOMMouseScroll", handleMouseScroll);
    return () => {
      window.removeEventListener("wheel", handleMouseScroll);
      window.removeEventListener("mousewheel", handleMouseScroll);
      window.removeEventListener("DOMMouseScroll", handleMouseScroll);
    };
  }, []); // 添加空依赖，避免每次渲染都执行

  // 判断滚动
  const handleMouseScroll = (e) => {
    if (e.wheelDelta) {
      if (e.wheelDelta > 0) {
        //当鼠标滚轮向上滚动时
        CarouselRef.current.prev();
      }
      if (e.wheelDelta < 0) {
        //当鼠标滚轮向下滚动时
        CarouselRef.current.next();
      }
    } else if (e.detail) {
      if (e.detail < 0) {
        //当鼠标滚轮向上滚动时
        CarouselRef.current.prev();
      }
      if (e.detail > 0) {
        //当鼠标滚轮向下滚动时
        CarouselRef.current.next();
      }
    }
  };

  return (
    <>
      <Header />
      <Carousel arrows dotPosition="left" autoplay={true} infinite={false} ref={CarouselRef} adaptiveHeight>
        {[1, 2, 3, 4, 5].map((item) => {
          return (
            <div key={item}>
              {/* <h3 className="contentStyle"> */}
              <img
                className="contentStyle"
                style={{ objectFit: "cover", height: imgHeight }}
                src={`https://bing.img.run/rand.php?${Math.random() * 1000}`}
                alt="无可显示图片"
              />
              {/* </h3> */}
            </div>
          );
        })}
      </Carousel>
      {/* <Hero /> */}
      {/* <Features /> */}
      {/* <Faq /> */}
      {/* <ContactForm /> */}
      {/* <Footer /> */}
      {/* // <div className="w-full flex flex-col">
          //   <div
          //     className="parallax-box"
          //     style={{
          //       backgroundImage: `url(https://bing.img.run/rand.php?${Math.random() * 1000})`,
          //     }}
          //   ></div>
          //   <div
          //     className="parallax-box"
          //     style={{
          //       backgroundImage: `url(https://bing.img.run/rand.php?${Math.random() * 1000})`,
          //     }}
          //   ></div>
          //   <div
          //     className="parallax-box"
          //     style={{
          //       backgroundImage: `url(https://bing.img.run/rand.php?${Math.random() * 1000})`,
          //     }}
          //   ></div>
          //   <div
          //     className="parallax-box"
          //     style={{
          //       backgroundImage: `url(https://bing.img.run/rand.php?${Math.random() * 1000})`,
          //     }}
          //   ></div>
          // </div> */}
    </>
  );
}

export default Home;
