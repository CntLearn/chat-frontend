import {
  Box,
  Text,
  Tooltip,
  Button,
  useDisclosure,
  useDisclosure as useDisclose,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  DrawerCloseButton,
  Spinner,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { SearchIcon } from "@chakra-ui/icons";
import UserListItem from "../../components/common/UserListItem";
import useShowToast from "../../components/useShowToast";
import { fetchUsers } from "../../apis/chat/users";
import { newConversation } from "../apis/conversation";

const SearchUsers = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // drawer open and close
  const {
    isOpen: D_isOpen,
    onOpen: D_onOpen,
    onClose: D_onClose,
  } = useDisclose();

  const btnRef = React.useRef();
  const ShowToast = useShowToast();

  const handleSearch = async () => {
    setLoading(true);

    try {
      const { data } = await fetchUsers(search);
      setSearchResults(data.data.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      ShowToast(
        "Fetch User Error",
        error.message || "User fetch error",
        "success"
      );
    }
  };

  const startNewChat = async (friendId) => {
    try {
      const { data } = await newConversation(userInfo._id, friendId);
      console.log("Chat started", data);
      if (data.success) {
        D_onClose();
      }
    } catch (error) {
      console.log("error : ", error);
    }
  };

  return (
    <React.Fragment>
      <Drawer
        isOpen={D_isOpen}
        placement="left"
        onClose={D_onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search By Name of Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                isDisabled={!search}
                isLoading={loading}
              >
                Go
              </Button>
            </Box>
            {searchResults.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleSearch={() => startNewChat(user._id)}
              />
            ))}

            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={D_onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
        bg={"white"}
        p={"5px 10px"}
      >
        <Tooltip hasArrow label="Search Users to Chat" placement="bottom-end">
          <Button onClick={D_onOpen}>
            <SearchIcon />
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              Start New Chat
            </Text>
          </Button>
        </Tooltip>
      </Box>
    </React.Fragment>
  );
};

export default SearchUsers;
