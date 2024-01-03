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
  useToast,
  FormControl,
  Input,
  Box,
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import { API_BASE_URL } from "../../consts";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import { ViewIcon } from "@chakra-ui/icons";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  fetchAllMessages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // setUser, chats, setChats,
  const { user, selectedChat, setSelectedChat } = ChatState();
  console.log(selectedChat);

  const [groupName, setGroupName] = useState(selectedChat.name);
  const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    return () => {
      resetStates();
    };
  }, []);

  useEffect(() => {
    setSelectedUsers(selectedChat.users);
    setGroupName(selectedChat.name);
  }, [selectedChat]);

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

  const addUserToGroup = async (addingUser) => {
    if (selectedChat.users.find((usr) => usr._id === addingUser._id)) {
      toast({
        title: "Group Add",
        description: "User Already Selected",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    if (!selectedChat.groupAdmin.find((usr) => usr._id === user._id)) {
      toast({
        title: "Group Add",
        description: "Group Admin Can Add Other Users",
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
      const { data } = await axios.put(
        `${API_BASE_URL}/chats/groupadd`,
        {
          groupId: selectedChat._id,
          userId: addingUser._id,
        },
        config
      );

      setFetchAgain(!fetchAgain);

      toast({
        title: "User Added",
        description: "User Added successfully",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      closeModal();
    } catch (error) {
      toast({
        title: "Group User add",
        description:
          error.message || "server error on adding user to group chat",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const closeModal = () => {
    onClose();
    resetStates();
  };

  const removeUserFromGroup = async (removedUser) => {
    if (selectedChat.groupAdmin.find((usr) => usr._id !== user._id)) {
      toast({
        title: "Remove User",
        description: "Group Admin Can Remove Users",
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
      const { data } = await axios.put(
        `${API_BASE_URL}/chats/groupremove`,
        {
          groupId: selectedChat._id,
          userId: removedUser._id,
        },
        config
      );

      if (data.success) {
        removedUser._id === user._id
          ? setSelectedChat("")
          : setSelectedChat(data.data.chats[0]);
        setFetchAgain(!fetchAgain);
        // after remove someone all messages should be refershed.
        fetchAllMessages();
        toast({
          title: "User Removed",
          description: `User ${removedUser.name} Removed Successfully`,
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "User Removed",
          description: `User ${removedUser.name} Cannot be removed due to an error`,
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }
    } catch (error) {
      toast({
        title: "User Remove",
        description:
          error.message || "Server error occurred while removing user",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const updateGroupName = async () => {
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        `${API_BASE_URL}/chats/rename`,
        {
          id: selectedChat._id,
          name: groupName,
        },
        config
      );
      if (data.success) {
        setSelectedChat(data.data.chats);
        setFetchAgain(!fetchAgain);
        toast({
          title: "Group Update",
          description: `Group Name Updated Successfully`,
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Group Update",
          description: `Some error occurred while updating`,
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }

      setRenameLoading(false);
    } catch (error) {
      setRenameLoading(false);

      toast({
        title: "Group Update",
        description:
          error.message || "Server error occurred while updating group",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <React.Fragment>
      <IconButton onClick={onOpen} icon={<ViewIcon />} />
      <Modal isOpen={isOpen} onClose={closeModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display={"flex"}
            fontSize={"35px"}
            fontFamily={"Work sans"}
            justifyContent={"center"}
          >
            {selectedChat.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            gap={5}
          >
            {
              // render selected users
            }
            <Box
              display={"flex"}
              alignItems={"center"}
              w={"100%"}
              flexWrap={"wrap"}
            >
              {Array.isArray(selectedChat.users) &&
                selectedChat.users.map((usr) => {
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
              // name updation
            }
            <FormControl display={"flex"}>
              <Input
                value={groupName}
                placeholder="Group Name"
                onChange={(e) => setGroupName(e.target.value)}
              />
              <Button
                colorScheme={"teal"}
                variant={"solid"}
                isLoading={renameLoading}
                ml={1}
                onClick={updateGroupName}
                isDisabled={!groupName}
              >
                Update
              </Button>
            </FormControl>

            <FormControl>
              <Input
                placeholder="Search Users to add in the group"
                onChange={(e) => handleSearchUsers(e.target.value)}
              />
            </FormControl>

            {
              // render chats...
            }

            {loading ? (
              <Spinner size={"lg"} />
            ) : (
              Array.isArray(searchResults) &&
              searchResults.slice(0, 4).map((usr) => {
                return (
                  <UserListItem
                    key={usr._id}
                    user={usr}
                    handleSearch={() => addUserToGroup(usr)}
                  />
                );
              })
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={closeModal} mr={2}>
              Close
            </Button>
            <Button
              colorScheme="green"
              onClick={() => removeUserFromGroup(user)}
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default UpdateGroupChatModal;
