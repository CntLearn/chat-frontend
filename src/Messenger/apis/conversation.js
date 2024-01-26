import axiosHttp from "../../apis";

const conversations = (userId) => {
  return axiosHttp.get(`/messenger/conversation/${userId}`);
};

const newConversation = (senderId, receiverId) => {
  return axiosHttp.post("/messenger/conversation", { senderId, receiverId });
};

export { conversations, newConversation };
