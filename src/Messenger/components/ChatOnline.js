import React from "react";
import pic from "../../assets/background.png";
import "../styles/chatOnline.css";
import { Avatar } from "@chakra-ui/react";
const ChatOnline = ({ usr }) => {
  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          {
            //    <img src={usr.pic} className="chatOnlineImage" />
          }

          <Avatar
            size={"sm"}
            // mr={2}
            name={usr?.name}
            cursor={"pointer"}
            src={usr?.pic}
            alt={usr?.name}
          />

          <div className="chatOnlineBadge" />
        </div>
        <span className="chatOnlineName"> {usr?.name} </span>
      </div>
    </div>
  );
};

export default ChatOnline;
