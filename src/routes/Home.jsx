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
              <h3 className="contentStyle">
                <img src={`https://bing.img.run/rand.php?${Math.random() * 1000}`} alt="无可显示图片" />
              </h3>
            </div>
          );
        })}
      </Carousel>
      {/* <div className="w-full flex flex-col">
        <div
          className="parallax-box"
          style={{
            backgroundImage: `url(https://bing.img.run/rand.php?${imageObjDay.image1})`,
          }}
        ></div>
        <div
          className="parallax-box"
          style={{
            backgroundImage: `url(https://bing.img.run/rand.php?${imageObjDay.image2})`,
          }}
        ></div>
        <div
          className="parallax-box"
          style={{
            backgroundImage: `url(https://bing.img.run/rand.php?${imageObjDay.image3})`,
          }}
        ></div>
        <div
          className="parallax-box"
          style={{
            backgroundImage: `url(https://bing.img.run/rand.php?${imageObjDay.image4})`,
          }}
        ></div>
      </div> */}
      {/* <Hero /> */}
      {/* <Features /> */}
      {/* <Faq /> */}
      {/* <ContactForm /> */}
      {/* <Footer /> */}
    </>
  );
}

export default Home;
