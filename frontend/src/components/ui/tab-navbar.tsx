import { Link, VStack, StackSeparator } from "@chakra-ui/react";

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
            padding={3}
            bg="#E8E8E8"
            justifyContent="center"
            separator={<StackSeparator alignSelf="center" borderRadius="10px" border="4px solid #A1A1AA66" width="20px"/>}
            gap={5}
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