import { TabNavBar, type Tab } from "@/components/ui/tab-navbar";
import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const tabs: Tab[] = [
    { label: "Users", path: "/admin/users" },
    { label: "Parser", path: "/admin/parser" },
];

export default function AdminPage() {
    return (
        <Flex height="100vh">
            <TabNavBar tabs={tabs}/>
            <Outlet/>
        </Flex>
    )
}