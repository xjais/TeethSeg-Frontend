import axios from "@/utils/axios";

// 获取所有容器
export const getListContainer = () => {
  return axios.get("/api/listContainers");
};

// 创建容器
export const createContainer = (data) => {
  return axios.get(`/api/createContainer?container=${data.container}`);
};

// 获取令牌
export const getSasLiPi = () => {
  return axios.get("/api/sas");
};

// 状态
export const getStatus = () => {
  return axios.get("/api/status");
};

// 获取容器内blob
export const getListBlob = () => {
  return axios.get("/api/list");
};
