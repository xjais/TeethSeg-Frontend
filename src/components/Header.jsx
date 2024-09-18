import MenuItems from "../services/header/MenuItems";
import Logo from "../services/header/Logo";
import Sign from "../services/header/Sign";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { ModeToggle } from "./ModeToggle";
import { Avatar, Row, Col } from "antd";
import { useLocation } from "react-router-dom";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const userInfo = window.localStorage.getItem("_authing_user") ? JSON.parse(window.localStorage.getItem("_authing_user")) : {};

  return (
    <>
      <div className={`header ${location.pathname === "/home" ? "headerSticky" : ""}`}>
        <Row className="mb-5 lg:mb-0 mt-5 lg:mt-0">
          <Col style={{ display: "flex", alignItems: "center" }} xs={{ span: 14, offset: 2 }} lg={{ span: 6, offset: 1 }}>
            <Logo />
            <div className="ml-5"></div>
            <ModeToggle />
          </Col>
          <Col style={{ display: "flex", alignItems: "center" }} xs={{ span: 0, offset: 0 }} lg={{ span: 6, offset: 3 }}>
            <div className="hidden lg:block">
              <MenuItems />
            </div>
          </Col>
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
            xs={{ span: 0, offset: 0 }}
            lg={{ span: 6, offset: 1 }}
          >
            <div className="hidden lg:block">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {userInfo.username ? userInfo.username : userInfo.email ? userInfo.email : userInfo.phone ? userInfo.phone : <></>}
                <div className="ml-5"></div>
                <Sign />
              </div>
            </div>
          </Col>
          <Col
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
            xs={{ span: 6, offset: 1 }}
            lg={{ span: 0, offset: 0 }}
          >
            <div
              className="bg-background text-foreground border p-2 rounded-md hover:text-background hover:bg-foreground cursor-pointer block lg:hidden z-10"
              onClick={() => {
                setMenuOpen((open) => !open);
              }}
            >
              <Menu />
              {menuOpen ? (
                <>
                  <div className="bg-background text-foreground  absolute top-20 left-0 flex-box flex-col pb-8 w-full ">
                    {" "}
                    <MenuItems />{" "}
                    {userInfo.username ? (
                      userInfo.username
                    ) : userInfo.email ? (
                      userInfo.email
                    ) : userInfo.phone ? (
                      <>
                        <div className="ml-5"></div>
                        <div>
                          用户/邮箱/手机号：
                          <span className="text-lg" style={{ fontWeight: "700" }}>
                            {userInfo.username ? userInfo.username : userInfo.email ? userInfo.email : userInfo.phone}
                          </span>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    <div className="mb-3"></div>
                    <Sign />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Header;
