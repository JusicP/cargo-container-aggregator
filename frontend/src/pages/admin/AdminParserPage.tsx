import { Button, ButtonGroup, Center, IconButton, Pagination, Stack, Table, Text } from "@chakra-ui/react";
import { Edit, Trash, User } from "@mynaui/icons-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function AdminParserPage() {
    return (
        <Stack gap="3">
            <Text textAlign="center">Вітаємо на вкладці "Управілння парсером оголошень"</Text>
            <Text textAlign="center">Тут ви зможете керувати інформацією про контейнери з парсера у формі таблиць та додавати нові оголошення</Text>

            <Button w="2xs" alignSelf="center" size="xl" color="#FD7F16" bgColor="white" borderColor="#FD7F16">Додати оголошення</Button>

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
                        <Table.ColumnHeader>Тип</Table.ColumnHeader>
                        <Table.ColumnHeader>Валюта</Table.ColumnHeader>
                        <Table.ColumnHeader>Колір</Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row key={1}>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>Test Company</Table.Cell>
                        <Table.Cell>parser</Table.Cell>
                        <Table.Cell textDecoration="underline" textDecorationColor="#FD7F16">source</Table.Cell>
                        <Table.Cell>Odessa, Ukraine</Table.Cell>
                        <Table.Cell>40ft High Cube</Table.Cell>
                        <Table.Cell>used</Table.Cell>
                        <Table.Cell>sale</Table.Cell>
                        <Table.Cell>USD</Table.Cell>
                        <Table.Cell>RAL5010</Table.Cell>
                        <Table.Cell>
                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color="red"><Trash /></IconButton>
                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color="#AEACAC"><Edit/></IconButton>
                        </Table.Cell>

                    </Table.Row>
                </Table.Body>
            </Table.Root>

            <Center>
            <Pagination.Root count={5} pageSize={5} page={1}>
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