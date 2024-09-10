import React, { useState, useContext, useEffect } from "react";
import { Form, Spin, Button, Modal, Tree, Input, message } from "antd";
import { useQuery, useQueryClient } from "react-query";
import axisoRequest from "@/utils/axios";
import FlagFileInfoMan from '@/contexts/flagFile';
import { useGuard } from "@authing/guard-react18";

const { Item } = Form;

const initTreeData = [
    // {
    //     title: 'upload',
    //     key: '0',
    // }
];

// It's just a simple demo. You can use tree map to optimize update perf.
const updateTreeData = (list, key, children) =>
    list.map((node) => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });

const App = () => {
    const guard = useGuard();
    const userInfo = window.localStorage.getItem('_authing_user') ? JSON.parse(window.localStorage.getItem('_authing_user')) : {}
    const { flagFile, setFlagFile } = useContext(FlagFileInfoMan);
    const [containerName, setContainerName] = useState(userInfo.username);
    const [treeData, setTreeData] = useState(initTreeData);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [formData, setFormData] = useState({});
    const [tableList, setTableList] = useState([]);
    const queryClient = useQueryClient();
    const [containerFlagInit, setContainerFlagInit] = useState(false);

    // 创建容器
    const containerQuery = useQuery(['listInfo'], () => {
        return axisoRequest.get(`/api/createContainer?container=${containerName}`).then((result) => {
            setTreeData((prev) => [
                ...prev,
                {
                    title: containerName,
                    key: "0",
                },
            ]);
            setContainerFlagInit(true);
            return result
        }).catch((error) => {
            console.log('qweqweqwewq',error)
            if (error.response.data.code === 'ContainerAlreadyExists') {
                setTreeData((prev) => [
                    ...prev,
                    {
                        title: containerName,
                        key: "0",
                    },
                ]);
                setContainerFlagInit(true);
            } else {
                message.error(error.message)
            }
        });
    }, { retry: false, refetchOnWindowFocus: false })

    // 查询容器内blob
    const listInfoQuery = useQuery(['listInfo'], () => {
        return axisoRequest.get(`/api/list?container=${containerName}`).then((result) => {
            const { data } = result;
            const { list } = data;
            const nameList = list.map(item => {
                const itemSplit = item.split('/')
                const name = itemSplit[itemSplit.length - 1]
                return {
                    title: name,
                    key: item,
                    url: item,
                }
            })
            setTreeData((origin) => updateTreeData(origin, "0", nameList))
            return result
        }).catch((error) => {
            message.error(error.message)
        });
    }, { retry: false, refetchOnWindowFocus: false, enabled: containerFlagInit });

    const onExpand = (expandedKeys, { expanded: boolean, node }) => { }

    // 刷新blob列表
    const onSelect = (selectedKeys, data,) => {
        if (data.node.key === '0') {
            listInfoQuery.refetch()
        } else {
            if (data.selected) {
                setFlagFile(data.node.url);
            } else {
                setFlagFile(null);
            }
        }
    }

    // 创建文件夹
    const handleModalSubmit = async () => {
        // // 创建容器
        // return axisoRequest.get(`/api/createContainer?container=${containerName}`).then((result) => {
        //     const { data } = result;
        //     console.log(result)
        //     // setTreeData((prev) => [
        //     //     ...prev,
        //     //     {
        //     //         title: formData.name,
        //     //         key: Math.floor(Math.random() * 1000000),
        //     //     },
        //     // ]);
        //     // setIsOpenModal(false);
        //     return result
        // }).catch((error) => {
        //     message.error(error.message)
        // });
    };

    const handleFileUpload = () => {
        axisoRequest.get(`/api/list?container=${containerName}`).then((result) => {
            const { data } = result;
            const { list } = data;
            const nameList = list.map(item => {
                const itemSplit = list[0].split('/')
                const name = itemSplit[itemSplit.length - 1]
                return {
                    title: name,
                    key: item,
                    url: item,
                }
            })
            setTreeData((origin) => updateTreeData(origin, "0", nameList))
        }).catch((error) => {
            message.error(error.message)
        });
    };

    return (
        <>
            {/* <Button
                type="primary"
                onClick={() => {
                    handleNewProject();
                }}
            >
                新建文件夹
            </Button> */}
            <Spin spinning={listInfoQuery.isLoading}>
                <div className="p-5">
                    <Tree
                        // loadData={onLoadData}
                        blockNode
                        autoExpandParent
                        defaultExpandParent={['0']}
                        // defaultExpandParent={['0']}
                        onExpand={onExpand}
                        onSelect={onSelect}
                        treeData={treeData}
                    />
                </div>
            </Spin>
            <Modal
                afterClose={() => {
                    setFormData({});
                }}
                open={isOpenModal}
                width={"30%"}
                title="新建文件夹"
                onCancel={() => {
                    setIsOpenModal(false);
                }}
                onOk={() => {
                    handleModalSubmit();
                }}
            >
                <Form>
                    <Item label="文件夹名称">
                        <Input
                            value={formData.name}
                            onChange={(event) => {
                                setFormData((prev) => ({
                                    ...prev,
                                    name: event.target.value,
                                }));
                            }}
                            maxLength={100}
                        />
                    </Item>
                </Form>
            </Modal>
        </>
    );
};
export default App;
