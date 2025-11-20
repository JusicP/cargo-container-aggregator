import { LIMIT, useLogs } from "@/services/api/logs";
import { Stack, Text, ScrollArea, Spinner, Button, VStack } from "@chakra-ui/react";
import { useState } from "react";

export default function AdminLogsPage() {
    const [offset, setOffset] = useState(0);

    const { data, isLoading, isFetching, refetch } = useLogs(offset);

    const hasMoreUp = offset > 0;
    const hasMoreDown = data && offset + LIMIT < data.total;

    return (
        <Stack gap="3">
            <Text textAlign="center">Вітаємо на вкладці “Журнал подій”.</Text>
            <Text textAlign="center">Тут ви зможете переглянути журнал сервера.</Text>

            <ScrollArea.Root h="full" align="center" size="lg" variant="always" borderWidth="1px">
                <ScrollArea.Viewport>
                    <ScrollArea.Content paddingEnd="5" textStyle="sm">
                        {hasMoreUp && (
                            <Button
                                size="xs"
                                variant="outline"
                                mb="2"
                                onClick={() => setOffset(Math.max(0, offset - LIMIT))}
                            >
                                More ↑
                            </Button>
                        )}

                        <VStack align="start" gap="1">
                            {isLoading ? (
                                <Spinner mt="10" />
                            ) : (
                                data?.logs.map((line: string, i: number) => (
                                    <Text key={i} fontFamily="monospace" whiteSpace="pre-wrap">
                                        {line}
                                    </Text>
                                ))
                            )}
                        </VStack>

                        {hasMoreDown && (
                            <Button
                                size="xs"
                                variant="outline"
                                mt="2"
                                onClick={() => setOffset(offset + LIMIT)}
                            >
                                More ↓
                            </Button>
                        )}

                        {isFetching && <Spinner size="sm" mt="3" />}
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar />
            </ScrollArea.Root>
        </Stack>
    )
}