import axiosHttp from "..";

const sendMessageToUser = async (message) => {
  return axiosHttp.post(`/messages`, message);
};

const fetchMessages = async (chatId) => {
  return axiosHttp.get(`/messages/${chatId}`);
};

export { sendMessageToUser, fetchMessages };
