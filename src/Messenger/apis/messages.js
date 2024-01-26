import axiosHttp from "../../apis";

const fetchMessages = (conversationId) => {
  return axiosHttp.get(`/messenger/message/${conversationId}`);
};

const sendMessages = (message) => {
  return axiosHttp.post("/messenger/message", message);
};

export { fetchMessages, sendMessages };
