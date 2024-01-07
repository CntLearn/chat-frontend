import axiosHttp from "..";

const fetchUsers = async (search) => {
  return axiosHttp.get(`/users?search=${search}`);
};

export { fetchUsers };
