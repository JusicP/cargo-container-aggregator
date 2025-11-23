import { Button, ButtonGroup, Center, IconButton, Pagination, Stack, Table, Text, useDisclosure } from "@chakra-ui/react";
import { Edit, Trash, User } from "@mynaui/icons-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ListingParserDlg } from "@/components/ui/listing-parser-dialog";
import { useDeleteListingParser, useListingParser, usePollListingParser, useRunListingParser, type ListingParser } from "@/services/api/listing_parser";
import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminParserPage() {
    const [page, setPage] = useState(1);
    const [editingParser, setEditingParser] = useState<ListingParser | null>(null);
    const [shouldPoll, setShouldPoll] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const { data, isLoading, isFetching } = useListingParser({
        page,
        page_size: 5,
    });

    const runParser = useRunListingParser();
    const deleteParser = useDeleteListingParser();
    const pollParser = usePollListingParser(shouldPoll);
    const queryClient = useQueryClient();
    
    const { open: isDlgOpen, onOpen: onDlgOpen, onClose: onDlgClose } = useDisclosure();

    const handleOpenCreate = () => {
        setEditingParser(null);
        onDlgOpen();
    };

    const handleOpenEdit = (parser: ListingParser) => {
        setEditingParser(parser);
        onDlgOpen();
    };

    const handleCloseDialog = () => {
        setEditingParser(null);
        onDlgClose();
    };

    const handleDelete = async (parserId: number) => {
        try {
            setDeletingId(parserId);
            await deleteParser.mutateAsync(parserId);
        } catch (error) {
            console.error("Failed to delete parser", error);
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        if (pollParser.data?.isRunning === false || pollParser.isError) {
            setShouldPoll(false);
        } else if (pollParser.data?.isRunning === true) {
            setShouldPoll(true);
        }
    }, [pollParser.data?.isRunning, pollParser.isError]);

    const handleRunParser = async () => {
        try {
            queryClient.removeQueries({ queryKey: ["listings", "parser", "poll"] });
            await runParser.mutateAsync();
            setShouldPoll(true);
        } catch (error) {
            setShouldPoll(false);
            console.error("Failed to run parser", error);
        }
    };

    const isParserRunning = useMemo(() => shouldPoll || pollParser.data?.isRunning === true, [pollParser.data?.isRunning, shouldPoll]);

    return (
        <Stack gap="3">
            <ListingParserDlg
                isOpen={isDlgOpen}
                onClose={handleCloseDialog}
                isEdit={!!editingParser}
                listingParser={editingParser}
            />
            
            <Text textAlign="center">Вітаємо на вкладці “Управління парсером оголошень”.</Text>
            <Text textAlign="center">Тут ви зможете керувати інформацією про контейнери з парсера у формі таблиць та додавати нові оголошення.</Text>

            <Stack direction="row" gap="3" alignSelf="center">
                <Button w="2xs" size="xl" color="#FD7F16" bgColor="white" borderColor="#FD7F16" onClick={handleOpenCreate}>Додати оголошення</Button>
                <Button
                    w="2xs"
                    size="xl"
                    color="white"
                    bgColor="#FD7F16"
                    _hover={{ bgColor: "#e86f0e" }}
                    onClick={handleRunParser}
                    disabled={isParserRunning || runParser.isPending}
                    loading={runParser.isPending}
                >
                    {isParserRunning ? "Парсер виконується..." : "Запустити парсер"}
                </Button>
            </Stack>

            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader><User color="#A1A1AA"/></Table.ColumnHeader>
                        <Table.ColumnHeader>Назва компанії</Table.ColumnHeader>
                        <Table.ColumnHeader>Метод</Table.ColumnHeader>
                        <Table.ColumnHeader>URL</Table.ColumnHeader>
                        <Table.ColumnHeader>Локація</Table.ColumnHeader>
                        <Table.ColumnHeader>Тип контейнера</Table.ColumnHeader>
                        <Table.ColumnHeader>Стан</Table.ColumnHeader>
                        <Table.ColumnHeader>Тип оголошення</Table.ColumnHeader>
                        <Table.ColumnHeader>Валюта</Table.ColumnHeader>
                        <Table.ColumnHeader>Повідомлення про помилку</Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                {!isLoading && !isFetching && (
                    <Table.Body>
                        {data?.listings.map((parser) => (
                            <Table.Row key={parser.id}>
                                <Table.Cell>{parser.id}</Table.Cell>
                                <Table.Cell>{parser.company_name}</Table.Cell>
                                <Table.Cell>{parser.method}</Table.Cell>
                                <Table.Cell textDecoration="underline" textDecorationColor="#FD7F16">{parser.url}</Table.Cell>
                                <Table.Cell>{parser.location}</Table.Cell>
                                <Table.Cell>{parser.container_type}</Table.Cell>
                                <Table.Cell>{parser.condition}</Table.Cell>
                                <Table.Cell>{parser.type}</Table.Cell>
                                <Table.Cell>{parser.currency}</Table.Cell>
                                <Table.Cell>{parser.error_message}</Table.Cell>
                                <Table.Cell>
                                    <IconButton
                                        variant={{ base: "ghost", _selected: "outline" }}
                                        color="red"
                                        aria-label="Видалити парсер"
                                        onClick={() => handleDelete(parser.id)}
                                        disabled={deletingId === parser.id}
                                        loading={deletingId === parser.id}
                                    >
                                        <Trash />
                                    </IconButton>
                                    <IconButton
                                        variant={{ base: "ghost", _selected: "outline" }}
                                        color="#AEACAC"
                                        onClick={() => handleOpenEdit(parser)}
                                    >
                                        <Edit/>
                                    </IconButton>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                )}
            </Table.Root>

            <Center>
                <Pagination.Root
                    count={data?.total ?? 0}
                    pageSize={data?.page_size ?? 10}
                    page={data?.page ?? page}
                    onPageChange={(p) => setPage(p.page)}
                >
                    <ButtonGroup variant="ghost" size="sm" wrap="wrap">
                        <Pagination.PrevTrigger asChild>
                            <IconButton>
                                <LuChevronLeft />
                            </IconButton>
                        </Pagination.PrevTrigger>

                        <Pagination.Items
                            render={(page) => (
                            <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                                {page.value}
                            </IconButton>
                            )}
                        />

                        <Pagination.NextTrigger asChild>
                            <IconButton>
                                <LuChevronRight />
                            </IconButton>
                        </Pagination.NextTrigger>
                    </ButtonGroup>
                </Pagination.Root>
            </Center>
        </Stack>
    )
}
