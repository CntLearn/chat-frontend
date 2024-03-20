import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { Box, Stack, Button, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getChatName } from "../../config/chatLogics";
import GroupChatModal from "./GroupChatModal";
import useShowToast from "../useShowToast";
import { fetchAllChats } from "../../apis/chat";

const MyChats = ({ fetchAgain }) => {
  const { user: loggedUser } = ChatState();
  const [noChats, setNoChats] = useState(false);
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const ShowToast = useShowToast();

  const fetchChats = async () => {
    try {
      const { data } = await fetchAllChats();
      setChats(data?.data?.chats);
      setTimeout(() => {
        setNoChats(true);
      }, 3000);
    } catch (error) {
      console.log(error);
      ShowToast(
        "Chat Access",
        error.message || "Chats fetching error",
        "error"
      );
    }
  };

  useEffect(() => {
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
                    {!!chat.isGroup
                      ? chat.name
                      : getChatName(loggedUser, chat.users)}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : noChats ? (
          "No Chats Available"
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
