import ContactForm from "../components/ContactForm";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Faq from "../components/FAQ";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import One1 from "../assets/one1.jpg";
import One2 from "../assets/one2.jpg";
import One3 from "../assets/one3.jpg";
import One4 from "../assets/one4.jpg";
import "./Home.css";

function Home() {
    const comp = useRef();
    useEffect(() => {
        // 这里写动画代码
        const sections = document.querySelectorAll(".section");
        sections.forEach((dom) => {
            gsap.fromTo(
                dom,
                {
                    backgroundPositionY: `-${window.innerHeight / 2}px`,
                },
                {
                    backgroundPositionY: `${window.innerHeight / 2}px`,
                    ease: "none",
                    scrollTrigger: {
                        trigger: dom,
                        scrub: true,
                    },
                }
            );
        });
        // return () => {
        //     // 清理工作（可选）
        // };
    }, []); // 添加空依赖，避免每次渲染都执行

    return (
        <>
            <Header />
            <div className="w-full flex flex-col">
                <div
                    className="parallax-box"
                    style={{
                        backgroundImage: `url(https://bing.img.run/rand.php?${
                            Math.random() * 1000
                        })`,
                    }}
                >
                    {/* <h1>header</h1> */}
                </div>
                <div
                    className="parallax-box"
                    style={{
                        backgroundImage: `url(https://bing.img.run/rand.php?${
                            Math.random() * 1000
                        })`,
                    }}
                >
                    {/* <h1>header</h1> */}
                </div>
                <div
                    className="parallax-box"
                    style={{
                        backgroundImage: `url(https://bing.img.run/rand.php?${
                            Math.random() * 1000
                        })`,
                    }}
                >
                    {/* <h1>header</h1> */}
                </div>
                <div
                    className="parallax-box"
                    style={{
                        backgroundImage: `url(https://bing.img.run/rand.php?${
                            Math.random() * 1000
                        })`,
                    }}
                >
                    {/* <h1>header</h1> */}
                </div>
                {/* <Hero /> */}
                {/* <Features /> */}
                {/* <Faq /> */}
                {/* <ContactForm /> */}
                {/* <Footer /> */}
            </div>
        </>
    );
}

export default Home;
