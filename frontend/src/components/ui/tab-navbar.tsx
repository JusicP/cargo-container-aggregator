import { Box, Button, Link, ListItem, VStack, Text } from "@chakra-ui/react";

export interface Tab {
    label: string;
    path: string;
}

interface TabNavBarProps {
    tabs: Tab[];
}

export function TabNavBar({tabs}: TabNavBarProps) {
    return (
        <VStack
            width="184px"
            minHeight="100vh"
            borderRight="1px solid #ddd"
            padding={3}
            bg="gray.50"
            justifyContent="center"
        >
            {tabs.map(tab => (
                <Link
                    href={tab.path}
                    textDecoration={location.pathname === tab.path ? "underline" : ""}
                    textDecorationColor="orange"
                    fontSize="xl"
                    textAlign="center"
                >
                    {tab.label}
                </Link>
            ))}
        </VStack>
    )
}