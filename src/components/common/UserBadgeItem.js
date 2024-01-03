import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, removeUser }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius={"lg"}
      m={1}
      mb={2}
      variant={"solid"}
      bgColor={"purple"}
      color={"white"}
      cursor={"pointer"}
      fontSize={15}
    >
      {user.name || user.email || "unknown user"}
      <CloseIcon fontSize={20} ml={2} p={1} onClick={removeUser} />
    </Box>
  );
};

export default UserBadgeItem;
