import React, { useState } from "react";
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import useShowToast from "../useShowToast";
import { registerUser } from "../../apis/auth.js";

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
  const ShowToast = useShowToast();

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
      ShowToast("Invalid Form", "Please fill all required fields.", "warning");

      setLoading(false);

      return;
    }
    if (password !== confirm) {
      ShowToast(
        "Password Validation",
        "Password and confirm password should be the same",
        "warning"
      );

      setLoading(false);

      return;
    }
    try {
      const userData = {
        name,
        email,
        password,
        pic: pic || "",
      };

      const { data } = await registerUser(userData);

      ShowToast(
        "User Register",
        data.message || "Register successfully",
        "success"
      );

      resetForm();
      return;
    } catch (error) {
      console.log(error);
      ShowToast(
        "Register Error",
        error.response?.data?.message || "Something went wrong",
        "error"
      );
      setLoading(false);
    }
  };
  const uploadImage = (pics) => {
    setLoading(true);

    if (!pics) {
      ShowToast("Upload Image", "Please select an image to upload", "warning");

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
          ShowToast("Upload Image", "Image Uploaded successfully", "success");

          setLoading(false);
        })
        .catch((err) => {
          console.log("error of pic : ", err);
          ShowToast(
            "Upload Image",
            "Some Error occurred while uploading",
            "error"
          );

          setLoading(false);
        });
    } else {
      ShowToast("Upload Image", "Please select an image to upload", "warning");
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
          variant="outline"
          value={name}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="text"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
          variant="outline"
          value={email}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            variant="outline"
            value={password}
          />
          <InputRightElement pr={0}>
            <IconButton
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShow(!show)}
            />
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
            variant="outline"
            value={confirm}
          />
          <InputRightElement pr={0}>
            <IconButton
              icon={show ? <ViewOffIcon /> : <ViewIcon />}
              onClick={() => setShow(!show)}
            ></IconButton>
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
          variant="outline"
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
