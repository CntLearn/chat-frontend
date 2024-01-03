import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Text,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { API_BASE_URL } from "../../consts";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";

const initialStates = {
  groupName: "",
  selectedUsers: [],
  searchResults: [],
  loading: false,
};

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, setUser, chats, setChats } = ChatState();

  const toast = useToast();
  useEffect(() => {
    return () => {
      resetStates();
    };
  }, []);
  const resetStates = () => {
    setGroupName();
    setSelectedUsers([]);
    setSearchResults([]);
    setLoading(false);
  };
  const handleSearchUsers = async (value) => {
    if (!value) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${API_BASE_URL}/users?search=${value}`,
        config
      );
      const filteredUsers = data?.data?.users?.filter(
        (usr) => usr._id !== user._id
      );
      setSearchResults(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.log("user error : ", error);
      toast({
        title: "user search error",
        description: error.message || "Server error occurred",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (selectedUsers.length < 2) {
      toast({
        title: "User Selection",
        description: "Atleast Two User must be Selected",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${API_BASE_URL}/chats/group`,
        {
          users: selectedUsers.map((user) => user._id),
          name: groupName,
        },
        config
      );

      setChats([data.data.chats[0], ...chats]);
      closeModal();

      toast({
        title: "Group Created",
        description: "Group Created successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Group creation",
        description: error.message || "server error on creating group chat",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const handleGroup = (user) => {
    if (selectedUsers.find((usr) => usr._id === user._id)) {
      toast({
        title: "User Selection",
        description: "User Already Selected",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
  };
  const closeModal = () => {
    onClose();
    resetStates();
  };

  const removeUserFromGroup = (user) => {
    let filteredUsers = [...selectedUsers];
    filteredUsers = filteredUsers.filter((usr) => usr._id !== user._id);
    setSelectedUsers([...filteredUsers]);
    toast({
      title: "User Removed",
      description: "User Removed Successfully",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top",
    });
  };
  return (
    <React.Fragment>
      <span onClick={onOpen}> {children} </span>
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            fontSize={"35px"}
            fontFamily={"Work sans"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={5}
          >
            <FormControl>
              <Input
                placeholder="Group Name"
                onChange={(e) => setGroupName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Search Users"
                onChange={(e) => handleSearchUsers(e.target.value)}
              />
            </FormControl>
            {
              // render selected users
            }
            <Box
              display={"flex"}
              alignItems={"center"}
              w={"100%"}
              flexWrap={"wrap"}
            >
              {Array.isArray(selectedUsers) &&
                selectedUsers.map((usr) => {
                  return (
                    <UserBadgeItem
                      key={usr._id}
                      user={usr}
                      removeUser={() => removeUserFromGroup(usr)}
                    />
                  );
                })}
            </Box>

            {
              // render chats...
            }
            {loading && <div>Loading...</div>}
            {Array.isArray(searchResults) &&
              searchResults.slice(0, 4).map((usr) => {
                return (
                  <UserListItem
                    key={usr._id}
                    user={usr}
                    handleSearch={() => handleGroup(usr)}
                  />
                );
              })}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={closeModal} mr={2}>
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={!groupName}
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default GroupChatModal;
