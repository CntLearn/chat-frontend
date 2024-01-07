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

import { useHistory } from "react-router-dom";
import useShowToast from "../useShowToast";
import { loginUser } from "../../apis/auth.js";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const ShowToast = useShowToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setLoading(false);
    setShow(false);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!password || !email) {
      ShowToast("Invalid Form", "Please fill all Required Fields.", "warning");
      setLoading(false);
      return;
    }

    try {
      const { data } = await loginUser({ email, password });

      ShowToast("User Logging", "User Logged In Successfully", "success");

      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
      history.push("/chats");
      window.location.reload(false);
      resetForm();
    } catch (error) {
      console.log(error);
      ShowToast(
        "Login Error",
        error.response.data.message || "Something went wrong",
        "error"
      );
      setLoading(false);
    }
  };

  return (
    <VStack spacing={5}>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          type="text"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
          variant="outline"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            variant="outline"
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
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("12345");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
