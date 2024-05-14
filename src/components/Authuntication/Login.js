import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import useShowToast from "../useShowToast";
import { loginUser } from "../../apis/auth.js";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider.js";
const INITIAL_STATE = {
  email: "",
  password: "",
};
const Login = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [show, setShow] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState();
  const navigate = useNavigate();
  const ShowToast = useShowToast();

  const resetForm = () => {
    setState(INITIAL_STATE);
    setLoading(false);
    setShow(false);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!state.password || !state.email) {
      ShowToast("Invalid Form", "Please fill all Required Fields.", "warning");
      setLoading(false);
      return;
    }

    try {
      const { email, password } = state;
      const { data } = await loginUser({ email, password });

      ShowToast("User Logging", "User Logged In Successfully", "success");
      const user = JSON.stringify(data.data.user)
      localStorage.setItem("userInfo", user);
      setUser(user)
      navigate("/app");
      resetForm();
    } catch (error) {
      console.log(error);
      ShowToast(
        "Login Error",
        error.response?.data.message || "Something went wrong",
        "error"
      );
      setLoading(false);
    }
  };
  const setStateFun = (event) => {
    const { name, value } = event.target;
    setState((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  return (
    <VStack spacing={5}>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={state.email}
          type="text"
          placeholder="Enter your Email"
          onChange={(e) => setStateFun(e)}
          variant="outline"
          name="email"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={state.password}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setStateFun(e)}
            variant="outline"
            name="password"
          />
          <InputRightElement pr={0}>
            <IconButton
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShow(!show)}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        w={"100%"}
        colorScheme={"blue"}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        w={"100%"}
        colorScheme={"red"}
        onClick={() =>
          setState({ email: "guest@example.com", password: "12345" })
        }
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
