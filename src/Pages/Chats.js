import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { ChatBox, MyChats, SideDrawer } from "../components/common";
import { Box } from "@chakra-ui/react";

// pages,, chatsPage
const Chats = () => {
  console.log("chats loaded");
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <Box>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        // w={"100%"}
        p={"5px"}
        h={"90vh"}
      >
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </Box>
  );
};

export default Chats;
