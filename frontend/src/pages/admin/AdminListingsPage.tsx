import { Box, ButtonGroup, Center, IconButton, Pagination, Stack, Switch, Table, Text, VStack } from "@chakra-ui/react";
import { Bookmark, Click, Edit, Eye, Trash, User } from "@mynaui/icons-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { Listing } from "@/services/api/listings";
import { extractPhotoUrl } from "@/components/ui/listing-card";
import RalColorBox from "@/components/ui/ral-color-box";

export default function AdminListingsPage() {
    const testListing: Listing = {
        id: 1,
        title: "test listing",
        description: "test desc",
        container_type: "40ft High Cube",
        condition: "used",
        type: "sale",
        price: 2500,
        currency: "USD",
        location: "Odessa, Ukraine",
        ral_color: "RAL5010",
        status: "approved",
        addition_date: "123",
        approval_date: "123",
        updated_at: "123",
    }

    return (
        <Stack gap="3">
            <Text textAlign="center">Вітаємо на вкладці “Модерація оголошень”.</Text>
            <Text textAlign="center">Тут ви зможете керувати інформацією та станом усіх оголошень сайту</Text>

            <Switch.Root>
                <Switch.HiddenInput />
                <Switch.Control/>
                <Switch.Label>Переглянути оголошення, які ще не пройшли модерацію</Switch.Label>
            </Switch.Root>

            <Table.Root size="sm">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader><User color="#A1A1AA"/></Table.ColumnHeader>
                        <Table.ColumnHeader>Вигляд</Table.ColumnHeader>
                        <Table.ColumnHeader>Про контейнер</Table.ColumnHeader>
                        <Table.ColumnHeader>URL</Table.ColumnHeader>
                        <Table.ColumnHeader>Локація</Table.ColumnHeader>
                        <Table.ColumnHeader>Статус</Table.ColumnHeader>
                        <Table.ColumnHeader><Click color="#A1A1AA"/></Table.ColumnHeader>
                        <Table.ColumnHeader><Eye color="#A1A1AA"/></Table.ColumnHeader>
                        <Table.ColumnHeader><Bookmark color="#A1A1AA"/></Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <Table.Row key={1}>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>
                            <Box
                                width="181px"
                                height="124px"
                                bgSize="cover"
                                bgRepeat="no-repeat"
                                bgImage={`url(${extractPhotoUrl(testListing)})`}
                                borderRadius="10px"
                            >

                            </Box>
                        </Table.Cell>
                        <Table.Cell>
                            <VStack align="left">
                                <Text fontWeight="bold">{testListing.container_type}</Text>
                                <Text>Ціна: {testListing.price} {testListing.currency}</Text>
                                <Text>Тип: {testListing.type}</Text>
                                <Text>Стан: {testListing.condition}</Text>
                                <RalColorBox ralColorKey={testListing.ral_color} />
                            </VStack>
                        </Table.Cell>
                        <Table.Cell textDecoration="underline" textDecorationColor="#FD7F16">testListing.url</Table.Cell>
                        <Table.Cell>{testListing.location}</Table.Cell>
                        <Table.Cell>{testListing.status}</Table.Cell>
                        <Table.Cell>0</Table.Cell>
                        <Table.Cell>0</Table.Cell>
                        <Table.Cell>0</Table.Cell>
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