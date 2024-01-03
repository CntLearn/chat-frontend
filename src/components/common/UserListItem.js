import React from "react";
import { Avatar, Box, Stack, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleSearch }) => {
  return (
    <Stack w={"100%"}>
      <Box
        cursor={"pointer"}
        onClick={handleSearch}
        w={"100%"}
        display={"flex"}
        bg={"$E8E8E8"}
        _hover={{
          background: "#38B2Ac",
          color: "white",
        }}
        alignItems={"center"}
        color={"black"}
        px={3}
        py={2}
        mb={2}
        borderRadius={"lg"}
        // justifyContent={"space-between"}
      >
        <Avatar
          size={"sm"}
          mr={2}
          name={user.name}
          cursor={"pointer"}
          src={user.pic}
          alt={user.name}
        />
        <Box>
          <Text fontSize={"lg"}>{user.name}</Text>
          <Text fontSize={"xs"}>
            <b>Email:</b> {user.email}
          </Text>
        </Box>
      </Box>
    </Stack>
  );
};

export default UserListItem;
