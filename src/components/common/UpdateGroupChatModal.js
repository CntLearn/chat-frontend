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
  IconButton,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserListItem from "./UserListItem";
import UserBadgeItem from "./UserBadgeItem";
import { ViewIcon } from "@chakra-ui/icons";
import useShowToast from "../useShowToast";
import { fetchUsers } from "../../apis/chat/users";
import { addToGroup, removeFromGroup } from "../../apis/chat/chats";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  fetchAllMessages,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // setUser, chats, setChats,
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupName, setGroupName] = useState(selectedChat.name);
  const [selectedUsers, setSelectedUsers] = useState(selectedChat.users);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [renameLoading, setRenameLoading] = useState(false);
  const ShowToast = useShowToast();
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

      const { data } = await fetchUsers(value);

      const filteredUsers = data?.data?.users?.filter(
        (usr) => usr._id !== user._id
      );
      setSearchResults(filteredUsers);
      setLoading(false);
    } catch (error) {
      console.log("user error : ", error);
      ShowToast(
        "User Search Error",
        error.message || "Server error occurred",
        "error"
      );

      setLoading(false);
    }
  };

  const addUserToGroup = async (addingUser) => {
    if (selectedChat.users.find((usr) => usr._id === addingUser._id)) {
      ShowToast("Group Add", "User Already Selected", "warning");
      return;
    }

    if (!selectedChat.groupAdmin.find((usr) => usr._id === user._id)) {
      ShowToast("Group Add", "Group Admin Can Add Other Users", "warning");
      return;
    }

    try {
      const group = {
        groupId: selectedChat._id,
        userId: addingUser._id,
      };

      const { data } = await addToGroup(group);

      setFetchAgain(!fetchAgain);
      ShowToast("User Added", "User Added successfully", "success");
      closeModal();
    } catch (error) {
      ShowToast(
        "Group User add",
        error.message || "server error on adding user to group chat",
        "error"
      );
    }
  };

  const closeModal = () => {
    onClose();
    resetStates();
  };

  const removeUserFromGroup = async (removedUser) => {
    if (selectedChat.groupAdmin.find((usr) => usr._id !== user._id)) {
      ShowToast("Remove User", "Group Admin Can Remove Users", "warning");
      return;
    }
    try {
      const group = {
        groupId: selectedChat._id,
        userId: removedUser._id,
      };
      const { data } = await removeFromGroup(group);

      if (data.success) {
        removedUser._id === user._id
          ? setSelectedChat("")
          : setSelectedChat(data.data.chats[0]);
        setFetchAgain(!fetchAgain);
        // after remove someone all messages should be refershed.
        fetchAllMessages();
        ShowToast(
          "User Removed",
          `User ${removedUser.name} Removed Successfully`,
          "success"
        );
      } else {
        ShowToast(
          "User Removed",
          `User ${removedUser.name} Cannot be removed due to an error`,
          "warning"
        );
      }
    } catch (error) {
      ShowToast(
        "User Remove",
        error.message || "Server error occurred while removing user",
        "error"
      );
    }
  };

  const updateGroupName = async () => {
    try {
      setRenameLoading(true);

      const group = {
        id: selectedChat._id,
        name: groupName,
      };

      const { data } = await updateGroupName(group);

      if (data.success) {
        setSelectedChat(data.data.chats);
        setFetchAgain(!fetchAgain);
        ShowToast("Group Update", `Group Name Updated Successfully`, "success");
      } else {
        ShowToast(
          "Group Update",
          `Some error occurred while updating`,
          "warning"
        );
      }

      setRenameLoading(false);
    } catch (error) {
      setRenameLoading(false);
      ShowToast(
        "Group Update",
        error.message || "Server error occurred while updating group",
        "error"
      );
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
