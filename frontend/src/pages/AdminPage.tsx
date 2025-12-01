import { TabNavBar, type Tab } from "@/components/ui/tab-navbar";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const tabs: Tab[] = [
    { label: "Управління парсером оголошень", path: "/admin/parser" },
    { label: "Модерація оголошень", path: "/admin/listings" },
    { label: "Журнал подій", path: "/admin/logs" },
    { label: "Управління користувачами", path: "/admin/users" },
];

export default function AdminPage() {
    return (
        <Flex width="100%">
            <TabNavBar tabs={tabs}/>
            <Box flex="1" p={5} pt={14}>
                <Outlet/>
            </Box>
        </Flex>
    )
}