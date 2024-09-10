import { setAssToken, setUserInfo } from "@/utils/auth";
// import { useGuard } from "@authing/guard-react18";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
    AuthClientProvider,
    Guard,
    GuardMode,
    User,
} from "@authing/react18-ui-components";
import "@authing/react18-ui-components/lib/index.min.css";
import { AuthenticationClient } from "authing-js-sdk";

function Login() {
    const navigate = useNavigate();
    // const guard = useGuard();
    const [user, setUser] = useState();
    const [visible, setVisible] = useState(false);

    const authClient = new AuthenticationClient({
        appId: "66cc8ab91d4c76192bda3a3a",
        appSecret: "198b6828fa50dd6eca3a03419cab8cc0",
        host: "https://teethseglood.authing.cn",
    });

    const style = {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #ccc",
    };

    // 检查用户是否有登录态
    const checkLoginStatus = React.useCallback(async () => {
        console.log(authClient);
        // authClient 登录成功时 会将用户相关信息存储在 localStorage 中
        const user = await authClient.getCurrentUser();

        const token = user.token;

        // 检查当前用户是否有登录态
        const { status } = await authClient.checkLoginStatus(token);

        if (status) setUser(user);
    }, []);

    React.useEffect(() => {
        checkLoginStatus();
    }, [checkLoginStatus]);

    const onLogin = (userInfo) => {
        setUser(userInfo);
        setVisible(false);
    };

    const onClose = () => {
        setVisible(false);
    };

    const showGuard = () => {
        setVisible(true);
    };

    const config = {
        mode: GuardMode.Modal,
    };

    return (
        <>
            <AuthClientProvider client={authClient}>
                <Guard
                    onLogin={onLogin}
                    // onClose={onClose}
                    // visible={visible}
                    // config={config}
                    // appId="66cc8ab91d4c76192bda3a3a"
                />
                {user ? (
                    // 如果拥有登录态 就显示登录用户的头像
                    <img src={`${user.photo}`} style={style} alt="user" />
                ) : (
                    <div
                        style={{ ...style, cursor: "pointer" }}
                        onClick={showGuard}
                    >
                        登录
                    </div>
                )}
            </AuthClientProvider>
        </>
    );
}

export default Login;
