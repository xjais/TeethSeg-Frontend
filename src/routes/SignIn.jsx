// Callback.tsx

// React 16/17
// 代码示例：https://github.com/Authing/Guard/blob/v5/examples/guard-react/normal/src/pages/Callback.tsx
// import { JwtTokenStatus, useGuard, User } from "@authing/guard-react";

// React 18
// 代码示例：https://github.com/Authing/Guard/blob/v5/examples/guard-react18/normal/src/pages/Callback.tsx
import { useGuard } from "@authing/guard-react18";

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SignInCss.css";

export default function Callback() {
  const navigate = useNavigate();
  const guard = useGuard();

  // 跳转到 Authing 托管页面登录
  const startWithRedirect = () => guard.startWithRedirect();

  const handleCallback = async () => {
    try {
      // 1. 触发 guard.handleRedirectCallback() 方法完成登录认证
      // 用户认证成功之后，我们会将用户的身份凭证存到浏览器的本地缓存中
      await guard.handleRedirectCallback();

      // 2. 处理完 handleRedirectCallback 之后，你需要先检查用户登录态是否正常
      const loginStatus = await guard.checkLoginStatus();

      if (!loginStatus) {
        return console.error("Guard is not get login status");
      }

      // 3. 获取到登录用户的用户信息
      const userInfo = await guard.trackSession();

      // 你也可以重定向到你的任意业务页面，比如重定向到用户的个人中心
      // 如果你希望实现登录后跳转到同一页面的效果，可以通过在调用 startWithRedirect 时传入的自定义 state 实现
      // 之后你在这些页面可以通过 trackSession 方法获取用户登录态和用户信息

      // 示例一：跳转到固定页面
      navigate("/start");

      // 示例二：获取自定义 state，进行特定操作
      // const search = window.location.search
      // 从 URL search 中解析 state
    } catch (e) {
      // 登录失败，推荐再次跳转到登录页面
      console.error("Guard handleAuthingLoginCallback error: ", e);
      startWithRedirect();
    }
  };

  useEffect(() => {
    handleCallback();
  });

  return (
    <div>
      <div class="loader">
        <div class="loader-inner">
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
          <div class="loader-line-wrap">
            <div class="loader-line"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
