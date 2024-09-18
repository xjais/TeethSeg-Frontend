import React, { useState, useContext, useEffect } from "react";
import { Form, Spin, Button, Modal, Tree, Input, message } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axiosRequest from "@/utils/axios";
import FlagFileInfoMan from "@/contexts/flagFile";
import AllLoadingMan from "@/contexts/allLoading";
import { useGuard } from "@authing/guard-react18";
import { getListContainer, createContainer } from "@/api/blobFuncApi";
import { getContainerNameSessionStorage, setContainerNameSessionStorage } from "@/utils/auth";
import "./TreeCss.css";

const { Item } = Form;

const initTreeData = [];

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

const TreeInfo = () => {
  const guard = useGuard();
  const [addFolderForm] = Form.useForm();
  const userInfo = window.localStorage.getItem("_authing_user") ? JSON.parse(window.localStorage.getItem("_authing_user")) : {};
  const { flagFile, setFlagFile } = useContext(FlagFileInfoMan);
  const { allLoading, setAllLoading } = useContext(AllLoadingMan);
  const [containerName, setContainerName] = useState();
  const [treeData, setTreeData] = useState(initTreeData);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [containerFlagInit, setContainerFlagInit] = useState(false);
  const [showLeafIcon, setShowLeafIcon] = useState(true);
  const [showLine, setShowLine] = useState(true);
  const { DirectoryTree } = Tree;

  // 查询所有已有容器 - 判断是否需要创建容器
  const getListContainerQuery = useQuery(
    ["getListContainerInfo"],
    () => {
      return getListContainer()
        .then((res) => {
          const { data } = res;
          const { list, status } = data;
          if (status === 200) {
            let name = "";
            let allName = "";
            const index = list.findIndex((item) => {
              const splitName = item.split("-");
              const lenName = splitName[splitName.length - 1];
              if (lenName === userInfo.id) {
                name = splitName[0];
                allName = item;
                return true;
              } else {
                return false;
              }
            });
            if (index === -1) {
              setIsOpenModal(true);
            } else {
              setTreeData((prev) => [
                {
                  title: name,
                  key: "0",
                  children: [
                    {
                      title: "输入",
                      key: "01",
                    },
                    {
                      title: "输出",
                      key: "02",
                    },
                  ],
                },
              ]);
              setContainerName(allName);
              setContainerNameSessionStorage(allName);
              if (containerFlagInit) {
                listInfoQuery.refetch();
              } else {
                setContainerFlagInit(true);
              }
            }
          } else {
            message.error(data.message);
          }
        })
        .catch((err) => {
          message.error(err.message);
        });
    },
    { retry: false, refetchOnWindowFocus: false }
  );

  // 查询容器内blob
  const listInfoQuery = useQuery(
    ["listInfo"],
    () => {
      return axiosRequest
        .get(`/api/list?container=${containerName}`)
        .then((result) => {
          const { data } = result;
          const { list } = data;
          let inputFolder = [];
          let outputFolder = [];
          const nameList = list.forEach((item) => {
            const itemSplit = item.split("/");
            const folder = itemSplit[itemSplit.length - 2];
            const name = itemSplit[itemSplit.length - 1];
            if (folder === "输入") {
              inputFolder.push({
                title: name,
                key: item,
                url: item,
                folder: "01",
                isLeaf: true,
              });
            } else {
              outputFolder.push({
                title: name,
                key: item,
                url: item,
                folder: "02",
                isLeaf: true,
              });
            }
          });
          setTreeData((origin) => updateTreeData(origin, "01", inputFolder));
          setTreeData((origin) => updateTreeData(origin, "02", outputFolder));
          return result;
        })
        .catch((error) => {
          message.error(error.message);
        });
    },
    { retry: false, refetchOnWindowFocus: false, enabled: containerFlagInit }
  );

  const onExpand = (expandedKeys, { expanded: boolean, node }) => {};

  // 刷新blob列表
  const onSelect = (selectedKeys, data) => {
    if (data.node.key === "0") {
      listInfoQuery.refetch();
    } else {
      if (data.selected) {
        setFlagFile(data.node.url);
      } else {
        setFlagFile(null);
      }
    }
  };

  // 创建文件夹
  const handleModalSubmit = async () => {
    try {
      await addFolderForm.validateFields();
      const addFolderFormData = addFolderForm.getFieldsValue();
      const iName = addFolderFormData.folderName + "-" + userInfo.id;
      createContainerMutation.mutate({
        container: iName,
      });
    } catch {}
  };

  const createContainerMutation = useMutation((data) => createContainer(data), {
    onSuccess: (res) => {
      if (res.status === 200) {
        const addFolderFormData = addFolderForm.getFieldsValue();
        setTreeData((prev) => [
          ...prev,
          {
            title: addFolderFormData.folderName,
            key: "0",
            children: [
              {
                title: "输入",
                key: "01",
              },
              {
                title: "输出",
                key: "02",
              },
            ],
          },
        ]);
        setIsOpenModal(false);
        const inName = addFolderFormData.folderName + "-" + userInfo.id;
        setContainerName(inName);
        setContainerNameSessionStorage(inName);
        if (containerFlagInit) {
          listInfoQuery.refetch();
        } else {
          setContainerFlagInit(true);
        }
        message.success("创建成功");
      } else {
        message.error("创建失败");
      }
    },
    onError: (error) => {
      message.error(error.message);
    },
  });

  const handleFileUpload = () => {
    axiosRequest
      .get(`/api/list?container=${containerName}`)
      .then((result) => {
        const { data } = result;
        const { list } = data;
        const nameList = list.map((item) => {
          const itemSplit = list[0].split("/");
          const name = itemSplit[itemSplit.length - 1];
          return {
            title: name,
            key: item,
            url: item,
          };
        });
        setTreeData((origin) => updateTreeData(origin, "0", nameList));
      })
      .catch((error) => {
        message.error(error.message);
      });
  };

  const handleNewProject = () => {
    listInfoQuery.refetch();
  };

  return (
    <>
      <div style={{}}>
        <div style={{ position: "relative", top: "-50px" }}>
          <Button
            type="primary"
            onClick={() => {
              handleNewProject();
            }}
            loading={listInfoQuery.isLoading}
          >
            查询
          </Button>
        </div>
        <div style={{ position: "relative", top: "-100px" }}>
          <Spin spinning={listInfoQuery.isLoading}>
            <div className="p-5">
              {treeData && treeData.length > 0 ? (
                <>
                  <DirectoryTree multiple defaultExpandedKeys={["0"]} onExpand={onExpand} onSelect={onSelect} treeData={treeData} />
                </>
              ) : (
                <></>
              )}
            </div>
          </Spin>
        </div>
        <Modal
          afterClose={() => {
            setFormData({});
          }}
          open={isOpenModal}
          width={"30%"}
          title="新建文件夹"
          onOk={() => {
            handleModalSubmit();
          }}
          closable={false}
          footer={(_, { OkBtn, CancelBtn }) => (
            <>
              {/* <Button>Custom Button</Button> */}
              {/* <CancelBtn /> */}
              <OkBtn />
            </>
          )}
        >
          <Form form={addFolderForm} autoComplete="off">
            <Item
              label="文件夹名称"
              name="folderName"
              rules={[
                { required: true, message: "请输入文件夹名称!" },
                { max: 30, message: "名称最多30个字符!" },
                ({ getFieldValue }) => ({
                  validator: (_, value) => {
                    const Pant = /[^\w_]/g;
                    if (Pant.test(value)) {
                      return Promise.reject("文件夹名称中不包含中文字符！");
                    }
                    if (value.includes("/") || value.includes("\\") || value.includes("-")) {
                      return Promise.reject("文件夹名称不包含 / 和 \\ 和 - ！");
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input maxLength={30} allowClear />
            </Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};
export default TreeInfo;
