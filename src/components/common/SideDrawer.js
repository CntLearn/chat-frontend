import {
  Box,
  Text,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  Avatar,
  MenuDivider,
  useDisclosure,
  useDisclosure as useDisclose,
  useToast,
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
import { API_BASE_URL } from "../../consts";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { SearchIcon, ChevronDownIcon, BellIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import Profile from "./Profile";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem";
import { getChatName } from "../../config/chatLogics";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // drawer open and close
  const {
    isOpen: D_isOpen,
    onOpen: D_onOpen,
    onClose: D_onClose,
  } = useDisclose();

  const history = useHistory();
  const {
    user,
    // selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const btnRef = React.useRef();
  const toast = useToast();

  const handleSearch = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/users?search=${search}`,
        config
      );
      setSearchResults(data.data.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Fetch User Error",
        description: "User fetch error",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    const user = JSON.parse(localStorage.getItem("userInfo"));
    const config = {
      headers: {
        "Content-type": "application/json",
        authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/chats`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data?.data?.chats[0]._id)) {
        setChats([data?.data?.chats[0], ...chats]);
      }
      setSelectedChat(data?.data?.chats);
      D_onClose();
      setLoadingChat(false);
    } catch (error) {
      setLoadingChat(false);
      console.log(error);
      toast({
        title: "Chat Access User Error",
        description: "Chat Access Error",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <React.Fragment>
      <Profile user={user} isOpen={isOpen} onClose={onClose} />

      {
        // left drawer
      }

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
            {loading ? (
              <ChatLoading />
            ) : (
              searchResults.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleSearch={() => accessChat(user._id)}
                />
              ))
            )}
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
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize={"2xl"} m={1} mr={3} />
            </MenuButton>
            {
              // will be create in futuer

              <MenuList p={2}>
                {!notification.length && "No any new messages"}

                {Array.isArray(notification) &&
                  notification.length > 0 &&
                  notification.map((notify) => {
                    return (
                      <MenuItem
                        key={notify._id}
                        onClick={() => {
                          setSelectedChat(notify.chatId);
                          // filter out the selected chat
                          setNotification(
                            notification.filter((n) => n !== notify)
                          );
                        }}
                      >
                        {notify.chatId.isGroup
                          ? `New Message in ${notify.name}`
                          : `New Message in ${getChatName(
                              user,
                              notify.chatId.users
                            )}`}
                      </MenuItem>
                    );
                  })}
              </MenuList>
            }
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                name={user.name}
                size={"sm"}
                cursor={"pointer"}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={onOpen}>My Profile</MenuItem>
              <MenuDivider />
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("userInfo");
                  history.push("/");
                  window.location.reload(false);
                  toast({
                    title: "Logout",
                    description: "User Logged out Successfully.",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                    position: "top",
                  });
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </React.Fragment>
  );
};

export default SideDrawer;
