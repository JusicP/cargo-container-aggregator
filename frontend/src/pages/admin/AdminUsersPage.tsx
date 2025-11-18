import { useUpdateUserStatus, useUsers, type User } from "@/services/api/users";
import { Button, ButtonGroup, Center, Group, IconButton, Input, InputGroup, Link, Pagination, Spinner, Stack, Table, Text } from "@chakra-ui/react";
import { Ban, Search, User as UserIcon, UserPlus } from "@mynaui/icons-react";
import { useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function AdminUsersPage() {
    const [searchQueryFilter, setSearchQueryFilter] = useState("");
    const [page, setPage] = useState(1);
    const { mutate: updateStatus, isPending } = useUpdateUserStatus();

    const {data, isLoading, refetch} = useUsers({
        searchQuery: searchQueryFilter || undefined,
        page,
        pageSize: 10,
    });

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

    const search = () => {
        setPage(1);
        refetch();
    };

    const banUnbanUser = (user: User) => {
        updateStatus({ userId: user.id, status: user.status == "active" ? "blocked": "active" });
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
                        value={searchQueryFilter}
                        onChange={(e) => setSearchQueryFilter(e.target.value)}
                    />
                </InputGroup>
                <Button size="sm" pl="12" pr="12" onClick={search}>
                    Пошук
                </Button>
            </Group>


            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader><UserIcon color="#A1A1AA"/></Table.ColumnHeader>
                        <Table.ColumnHeader>Ім'я користувача</Table.ColumnHeader>
                        <Table.ColumnHeader>Назва компанії</Table.ColumnHeader>
                        <Table.ColumnHeader>Роль</Table.ColumnHeader>
                        <Table.ColumnHeader>Статус</Table.ColumnHeader>
                        <Table.ColumnHeader>Номер телефону</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">Пошта</Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                {!isLoading && (
                    <Table.Body>
                        {data?.users.map((user) => (
                            <Table.Row key={user.id}>
                                <Table.Cell>{user.id}</Table.Cell>
                                <Table.Cell>{user.name}</Table.Cell>
                                <Table.Cell color={colorIfNull(user.companyName == null)}>{user.companyName || "null"}</Table.Cell>
                                <Table.Cell>{user.role}</Table.Cell>
                                <Table.Cell color={statusToColor(user.status)}>{user.status}</Table.Cell>
                                <Table.Cell color={colorIfNull(user.phoneNumber == null)}>{user.phoneNumber || "null"}</Table.Cell>
                                <Table.Cell textAlign="center" textDecoration="underline" textDecorationColor="#FD7F16">{user.email}</Table.Cell>
                                <Table.Cell>
                                    <IconButton variant={{ base: "ghost", _selected: "outline" }} color={statusToBanBtnColor(user.status)} onClick={() => banUnbanUser(user)}><Ban/></IconButton>
                                    <IconButton as={Link} variant={{ base: "ghost", _selected: "outline" }} color={statusToEditBtnColor(user.status)} href={`/profile/${user.id}`}><UserPlus/></IconButton>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                )}
            </Table.Root>

            {isLoading && (
                <Center>
                    <Spinner size="xl"/>
                </Center>
            )}

            <Center>
                <Pagination.Root
                    count={data?.total ?? 0}
                    pageSize={data?.pageSize ?? 10}
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