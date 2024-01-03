import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { API_BASE_URL } from "../../consts";
import { AddIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";
import { getChatName } from "../../config/chatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState("");
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } =
    ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.get(`${API_BASE_URL}/chats`, config);
      setChats(data?.data?.chats);
    } catch (error) {
      console.log(error);
      toast({
        title: "Chat Access",
        description: error.message || "Chats fetching error",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir={"column"}
      w={{ base: "100%", md: "31%" }}
      alignItems={"center"}
      p={2}
      bg={"white"}
      borderRadius={"lg"}
      borderWidth={"1px"}
      fontSize={{ base: "24px", md: "26px" }}
    >
      <Box
        display={"flex"}
        pb={3}
        px={3}
        w={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={"flex"}
            rightIcon={<AddIcon />}
            fontSize={{ base: "15px", md: "10px", lg: "15px" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      {
        // render all chats
      }
      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg={"#F8F8F8"}
        w={"100%"}
        h={"100%"}
        overflowY={"hidden"}
        borderRadius={"lg"}
      >
        {Array.isArray(chats) && chats.length > 0 ? (
          <Stack overflowY={"scroll"}>
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={2}
                  py={2}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  <Text>
                    {chat.isGroup
                      ? chat.name
                      : getChatName(loggedUser, chat.users)}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
