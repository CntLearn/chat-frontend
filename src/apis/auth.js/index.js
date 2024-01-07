import { Axios } from "..";

const registerUser = async (user) => {
  return Axios.post(`/users`, user);
};

const loginUser = async (user) => {
  return Axios.post(`/users/login`, user);
};

export { registerUser, loginUser };
