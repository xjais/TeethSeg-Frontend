import "../styles/Main.css";
import { Flex, Layout, Image } from "antd";
const { Header, Footer, Sider, Content } = Layout;
import VTKViewer from "../services/main/Upload";
import FlagFileInfoMan from '@/contexts/flagFile';
import { useContext, useEffect, useState } from "react";
import ThreeDRenderer from "@/components/ThreeRenderer";
import axios from 'axios'

function Main() {
    const { flagFile, setFlagFile } = useContext(FlagFileInfoMan);
    const [fileNameFlag, setFileNameFlag] = useState(false);
    const [fileBlob, setFileBlob] = useState(null)

    useEffect(() => {
        if (!flagFile) return;
        const fileNameList = flagFile.split('.');
        const index = fileNameList[fileNameList.length - 1];
        if (index === 'png' || index === 'jpg' || index === 'jpeg') {
            setFileNameFlag(true);
        } else {
            axios.get(`${flagFile}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((res) => {
                console.log(res.data)
                const itemSplit = flagFile.split('/')
                const name = itemSplit[itemSplit.length - 1]
                const blobInfo = blobToFile(res.data, name)
                setFileBlob(blobInfo)
            })
            setFileNameFlag(false);
        }
    }, [flagFile])

    function blobToFile(blob, filename, type) {
        return new File([blob], filename, { type })
    }

    return (
        <div className="text-center w-full h-full flex-box flex-col scroll-smooth bg-primary-background lg:px-64 px-12">
            {
                flagFile ? <>
                    {
                        fileNameFlag ? <>
                            <Image
                                width={'24vw'}
                                src={flagFile}
                            />
                        </> : <>
                            <div className="text-center flex-box flex-col">
                                <ThreeDRenderer file={fileBlob} />
                            </div>
                        </>
                    }
                </> : <>
                    <VTKViewer />
                </>
            }
        </div>
    );
}

export default Main;
