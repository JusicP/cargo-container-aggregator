import { Box, Button, ButtonGroup, Center, IconButton, Link, Pagination, Spinner, Stack, Switch, Table, Text, VStack } from "@chakra-ui/react";
import { Bookmark, Check, Click, Eye, Trash, User, X } from "@mynaui/icons-react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useListings, useUpdateListingStatus, type Listing } from "@/services/api/listings";
import { extractPhotoUrl } from "@/components/ui/listing-card";
import RalColorBox from "@/components/ui/ral-color-box";
import { useState } from "react";

export default function AdminListingsPage() {
    const [statusFilter, setStatusFilter] = useState("");
    const [page, setPage] = useState(1);
    const { mutate: updateStatus } = useUpdateListingStatus();

    const { data, isLoading, isRefetching, refetch } = useListings({
        status: statusFilter,
        page,
        page_size: 5,
    });

    const applyFilters = () => {
        setPage(1);
        refetch();
    };

    const colorIfNull = (isNull: boolean) => {
        return isNull ? "#A1A1AA" : "inherit";
    }

    const updateListingStatus = (listing: Listing, status: string) => {
        updateStatus({listingId: listing.id, status})
    }

    return (
        <Stack gap="3">
            <Text textAlign="center">Вітаємо на вкладці “Модерація оголошень”.</Text>
            <Text textAlign="center">Тут ви зможете керувати інформацією та станом усіх оголошень сайту</Text>

            <Switch.Root onCheckedChange={(details) => {setStatusFilter(details.checked ? "" : "pending"); applyFilters()}}>
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
                {!isLoading && !isRefetching && (
                    <Table.Body>
                        {data?.listings.map(listing => (
                            <Table.Row key={listing.id}>
                                <Table.Cell>{listing.id}</Table.Cell>
                                <Table.Cell>
                                    <Box
                                        width="181px"
                                        height="124px"
                                        bgSize="cover"
                                        bgRepeat="no-repeat"
                                        bgImage={`url(${extractPhotoUrl(listing)})`}
                                        borderRadius="10px"
                                    />
                                </Table.Cell>
                                <Table.Cell>
                                    <VStack align="left">
                                        <Text fontWeight="bold">{listing.container_type}</Text>
                                        <Text>Ціна: {listing.last_history.price} {listing.currency}</Text>
                                        <Text>Тип: {listing.type}</Text>
                                        <Text>Стан: {listing.condition}</Text>
                                        <RalColorBox ralColorKey={listing.ral_color} />
                                    </VStack>
                                </Table.Cell>
                                <Table.Cell textDecoration="underline" textDecorationColor="#FD7F16" color={colorIfNull(listing.original_url == null)}>
                                    <Link href={listing.original_url}>
                                        {listing.original_url || "null"}
                                    </Link>
                                </Table.Cell>
                                <Table.Cell>{listing.location}</Table.Cell>
                                <Table.Cell>{listing.status}</Table.Cell>
                                <Table.Cell>{listing.last_history.views}</Table.Cell>
                                <Table.Cell>{listing.last_history.contacts}</Table.Cell>
                                <Table.Cell>{listing.last_history.favorites}</Table.Cell>
                                <Table.Cell>
                                    {listing.status == "pending" && (
                                        <>
                                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color="green" onClick={() => updateListingStatus(listing, "active")}><Check /></IconButton>
                                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color="red" onClick={() => updateListingStatus(listing, "rejected")}><X /></IconButton>
                                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color="red" onClick={() => updateListingStatus(listing, "deleted")}><Trash /></IconButton>
                                        </>
                                    )}
                                    {listing.status == "active" && (
                                        <>
                                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color="red" onClick={() => updateListingStatus(listing, "deleted")}><Trash /></IconButton>
                                        </>
                                    )}
                                    {listing.status == "rejected" && (
                                        <>
                                            <Button variant={{ base: "ghost", _selected: "outline" }} color="red" onClick={() => updateListingStatus(listing, "pending")}>Pending</Button>
                                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color="green" onClick={() => updateListingStatus(listing, "active")}><Check /></IconButton>
                                            <IconButton variant={{ base: "ghost", _selected: "outline" }} color="red" onClick={() => updateListingStatus(listing, "deleted")}><Trash /></IconButton>
                                        </>
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                )}
            </Table.Root>

            {isLoading || isRefetching && (
                <Center>
                    <Spinner size="xl"/>
                </Center>
            )}

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