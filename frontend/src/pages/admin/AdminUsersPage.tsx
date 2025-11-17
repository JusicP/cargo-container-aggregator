import { Button, ButtonGroup, Center, Group, IconButton, Input, InputGroup, Pagination, Stack, Table, Text } from "@chakra-ui/react";
import { Ban, Search, User, UserPlus } from "@mynaui/icons-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function AdminUsersPage() {
    const statusToColor = (status: string) => {
        switch (status) {
            case "active":
                return "#FD7F16";
            case "blocked":
                return "#A1A1AA";
        }
        return "#A1A1AA";
    }

    const statusToBanBtnColor = (status: string) => {
        switch (status) {
            case "active":
                return "red";
            case "blocked":
                return "#A1A1AA";
        }
        return "#A1A1AA";
    }
    const statusToEditBtnColor = (status: string) => {
        switch (status) {
            case "active":
                return "#A1A1AA";
            case "blocked":
                return "green";
        }
        return "#A1A1AA";
    }
    
    const colorIfNull = (isNull: boolean) => {
        return isNull ? "#A1A1AA" : "inherit";
    }

    return (
        <Stack gap="3">
            <Text textAlign="center">Вітаємо на вкладці “Управління користувачами”.</Text>
            <Text textAlign="center">Тут ви зможете переглядати та керувати авторизованими на сайті користувачами</Text>
            
            <Group attached display="flex" m="5" ms="196px" mr="196px">
                <InputGroup startElement={<Search size="14" />}>
                    <Input 
                        size="sm" 
                        flex="1"
                        placeholder="Введіть ім’я, пошту, телефон користувача" 
                    />
                </InputGroup>
                <Button size="sm" pl="12" pr="12">
                    Пошук
                </Button>
            </Group>


            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader><User color="#A1A1AA"/></Table.ColumnHeader>
                        <Table.ColumnHeader>Ім'я користувача</Table.ColumnHeader>
                        <Table.ColumnHeader>Назва компанії</Table.ColumnHeader>
                        <Table.ColumnHeader>Роль</Table.ColumnHeader>
                        <Table.ColumnHeader>Статус</Table.ColumnHeader>
                        <Table.ColumnHeader>Номер телефону</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Пошта</Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row key={1}>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>John Doe</Table.Cell>
                        <Table.Cell>TechSolutions</Table.Cell>
                        <Table.Cell>admin</Table.Cell>
                        <Table.Cell color={statusToColor("active")}>active</Table.Cell>
                        <Table.Cell>+380501234567</Table.Cell>
                        <Table.Cell textAlign="center" textDecoration="underline" textDecorationColor="#FD7F16">john.doe.123@example.com</Table.Cell>
                        <Table.Cell>
                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color={statusToBanBtnColor("active")}><Ban/></IconButton>
                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color={statusToEditBtnColor("active")}><UserPlus/></IconButton>
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