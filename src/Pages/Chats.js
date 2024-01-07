import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { ChatBox, MyChats, SideDrawer } from "../components/common";
import { Box } from "@chakra-ui/react";
// pages,, chatsPage
const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent={"space-between"}
        w={"100%"}
        p={"5px"}
        h={"93.5vh"}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chats;
