import React, { useEffect, useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../consts";

const cloudinary_base_url =
  "https://api.cloudinary.com/v1_1/dvafcmdcx/image/upload";
const cloud_name = "dvafcmdcx";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirmPassword] = useState("");
  const [show, setShow] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPic("");
    setShow(false);
    setLoading(false);
  };

  const submitHandler = async () => {
    setLoading(true);
    console.log(name, email, password, confirm);
    if (!name || !email || !password || !confirm) {
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
    if (password !== confirm) {
      toast({
        title: "Password Validation",
        description: "Password and confirm password should be the same",
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
        name,
        email,
        password,
        pic,
      };
      const { data } = await axios.post(
        `${API_BASE_URL}/users`,
        userData,
        config
      );

      toast({
        title: "User Register",
        description: "Register successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      resetForm();
      return;
    } catch (error) {
      console.log(error);
      toast({
        title: "Register Error",
        description: error.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  const uploadImage = (pics) => {
    setLoading(true);

    if (!pics) {
      toast({
        title: "Upload Image",
        description: "Please select an image to upload",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chatApp");
      data.append("cloud-name", cloud_name);
      fetch(cloudinary_base_url, {
        method: "POST",
        body: data,
      })
        .then((response) => response.json())
        .then((res) => {
          setPic(res.url.toString());
          toast({
            title: "Upload Image",
            description: "Image Uploaded successfully",
            status: "success",
            duration: 4000,
            isClosable: true,
            position: "top",
          });

          setLoading(false);
        })
        .catch((err) => {
          console.log("error of pic : ", err);
          toast({
            title: "Upload Image",
            description: "Some Error occurred while uploading",
            status: "error",
            duration: 4000,
            isClosable: true,
            position: "top",
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Upload Image",
        description: "Please select an image to upload",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);

      return;
    }
  };
  return (
    <VStack spacing={5}>
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          variant="filled"
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
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

      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="filled"
          />
          <InputRightElement pr={2}>
            <Button onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          placeholder="Enter your Email"
          onChange={(e) => uploadImage(e.target.files[0])}
          variant="filled"
        />
      </FormControl>
      <Button
        w={"100%"}
        colorScheme={"blue"}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
