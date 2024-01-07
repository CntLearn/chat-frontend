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
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import useShowToast from "../useShowToast";
import { fetchUsers } from "../../apis/chat/users";
import { createGroup } from "../../apis/chat/chats";

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

  const { user, chats, setChats } = ChatState();
  const ShowToast = useShowToast();
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

      const { data } = await fetchUsers(value);

      const filteredUsers = data?.data?.users?.filter(
        (usr) => usr._id !== user._id
      );
      setSearchResults(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.log("user error : ", error);
      ShowToast(
        "user search error",
        error.message || "Server error occurred",
        "error"
      );

      setLoading(false);
    }
  };
  const handleSubmit = async () => {
    if (selectedUsers.length < 2) {
      ShowToast(
        "User Selection",
        "Atleast Two User must be Selected",
        "warning"
      );

      return;
    }
    try {
      const users = selectedUsers.map((user) => user._id);

      const { data } = await createGroup(users, groupName);

      setChats([data.data.chats[0], ...chats]);
      closeModal();
      ShowToast("Group Created", "Group Created successfully", "success");
    } catch (error) {
      console.log(error);
      ShowToast(
        "Group creation",
        error.message || "server error on creating group chat",
        "error"
      );
    }
  };

  const handleGroup = (user) => {
    if (selectedUsers.find((usr) => usr._id === user._id)) {
      ShowToast("User Selection", "User Already Selected", "warning");

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
    ShowToast("User Removed", "User Removed Successfully", "success");
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
