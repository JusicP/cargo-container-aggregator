import { Stack, Text, ScrollArea } from "@chakra-ui/react";

export default function AdminLogsPage() {
    return (
        <Stack gap="3">
            <Text textAlign="center">Вітаємо на вкладці “Журнал подій”.</Text>
            <Text textAlign="center">Тут ви зможете переглянути журнал сервера.</Text>

            <ScrollArea.Root align="center" size="lg" height="8rem" variant="always">
                <ScrollArea.Viewport>
                <ScrollArea.Content paddingEnd="5" textStyle="sm">
                    Fuck
                </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar />
            </ScrollArea.Root>
        </Stack>
    )
}