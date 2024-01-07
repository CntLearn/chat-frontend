import axiosHttp from "../";

const fetchAllChats = async () => {
  return axiosHttp.get("/chats");
};

const accessChatToUser = async (userId) => {
  return axiosHttp.post(`/chats`, { userId });
};

const createGroup = async (users, name) => {
  return axiosHttp.post(`/chats/group`, {
    users,
    name,
  });
};

const addToGroup = async (group) => {
  return axiosHttp.put(`/chats/groupadd`, group);
};

const removeFromGroup = async (group) => {
  return axiosHttp.put(`/chats/groupremove`, group);
};

const updateGroupName = async (group) => {
  return axiosHttp.put(`/chats/rename`, group);
};

export {
  fetchAllChats,
  accessChatToUser,
  createGroup,
  addToGroup,
  removeFromGroup,
  updateGroupName,
};
