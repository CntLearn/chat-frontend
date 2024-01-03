import { useToast } from "@chakra-ui/react";
const SuccessToaster = (head, des) => {
  const toast = useToast();

  return toast({
    title: head,
    description: des,
    status: "success",
    duration: 4000,
    isClosable: true,
    position: "top",
  });
};

export default SuccessToaster;
