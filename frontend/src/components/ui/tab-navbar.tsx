import { Box, Button, Link, ListItem, VStack } from "@chakra-ui/react";

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
            padding={4}
            align="stretch"
        >
            {tabs.map(tab => (
                <Button
                    key={tab.path}
                    variant={location.pathname === tab.path ? "solid" : "ghost"}
                >
                    {tab.label}
                </Button>
            ))}
        </VStack>
    );
}