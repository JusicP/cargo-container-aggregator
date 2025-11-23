import { Button, ButtonGroup, Center, IconButton, Pagination, Stack, Table, Text, useDisclosure } from "@chakra-ui/react";
import { Edit, Trash, User } from "@mynaui/icons-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { ListingParserDlg } from "@/components/ui/listing-parser-dialog";
import { useListingParser, type ListingParser } from "@/services/api/listing_parser";
import { useState } from "react";

export default function AdminParserPage() {
    const [page, setPage] = useState(1);
    const [editingParser, setEditingParser] = useState<ListingParser | null>(null);

    const { data, isLoading, isFetching } = useListingParser({
        page,
        page_size: 5,
    });

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

    return (
        <Stack gap="3">
            <ListingParserDlg
                isOpen={isDlgOpen}
                onClose={handleCloseDialog}
                isEdit={!!editingParser}
                listingParser={editingParser}
            />
            
            <Text textAlign="center">Список парсерів для автоматичного збору оголошень</Text>
            <Text textAlign="center">Додайте або відредагуйте налаштування парсерів, щоб коректно підтягувати оголошення з потрібних сайтів та локацій.</Text>

            <Button w="2xs" alignSelf="center" size="xl" color="#FD7F16" bgColor="white" borderColor="#FD7F16" onClick={handleOpenCreate}>Додати парсер</Button>

            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader><User color="#A1A1AA"/></Table.ColumnHeader>
                        <Table.ColumnHeader>ID</Table.ColumnHeader>
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
                                    <IconButton variant={{ base: "ghost", _selected: "outline" }} color="red"><Trash /></IconButton>
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
