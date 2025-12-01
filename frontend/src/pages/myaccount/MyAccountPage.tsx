import { Outlet, useLocation } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { TabNavBar, type Tab } from "@/components/ui/tab-navbar";

const tabs: Tab[] = [
    { label: "Профіль користувача", path: "/myaccount/profile" },
    { label: "Оголошення", path: "/myaccount/listings" },
    { label: "Налаштування", path: "/myaccount/user-settings" },
];

export default function MyAccountPage() {
  return (
    <Flex width="100%">
        <TabNavBar tabs={tabs}/>
        <Box flex="1" p={5} pt={14}>
            <Outlet/>
        </Box>
    </Flex>
  );
}
