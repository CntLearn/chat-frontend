import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../consts";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const toast = useToast();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setLoading(false);
    setShow(false);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!password || !email) {
      toast({
        title: "Invalid Form",
        description: "Please fill all required fields.",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);

      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const userData = {
        email,
        password,
      };
      const { data } = await axios.post(
        `${API_BASE_URL}/users/login`,
        userData,
        config
      );

      toast({
        title: "User Logging",
        description: "User Logged In Successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
      history.push("/chats");
      window.location.reload(false);
      resetForm();
    } catch (error) {
      console.log(error);
      toast({
        title: "Login Error",
        description: error.response.data.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
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
          variant="filled"
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
            variant="filled"
          />
          <InputRightElement pr={2}>
            <Button onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
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
