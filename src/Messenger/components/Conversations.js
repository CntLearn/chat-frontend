import React from "react";
import pic from "../../assets/background.png";
import "../styles/conversations.css";
import { Avatar } from "@chakra-ui/react";
const Conversations = ({ friend }) => {
  return (
    <div className="conversation">
      {
        // <img src={friend.pic ? friend.pic : pic} className="conversationImg" />
      }
      <Avatar
        size={"sm"}
        // mr={2}
        name={friend.name}
        cursor={"pointer"}
        src={friend.pic}
        alt={friend.name}
      />
      <span className="conversationName">
        {friend.name || "No name"}
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
          }}
        >
          {friend.email}
          {
            //friend.email?.includes("@gmail.com") ? "" : "@gmail.com"
          }
        </p>
      </span>
    </div>
  );
};

export default Conversations;
