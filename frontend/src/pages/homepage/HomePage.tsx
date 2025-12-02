import background from "@/assets/background.png";
import '@/pages/homepage/homepage.css'
import { Button, ButtonGroup, Center, Checkbox, CheckboxGroup, Fieldset, Flex, Group, IconButton, Input, InputGroup, NativeSelect, NumberInput, Pagination, Spinner, Text } from "@chakra-ui/react";
import { ChevronLeft, ChevronRight, Search, ShootingStarSolid } from "@mynaui/icons-react";
import { useListings, type ListingFilters } from "@/services/api/listings";
import { useState } from "react";
import FilterableCheckboxGroup from "@/components/ui/filterable-checkbox-group";

import RalColorBox from "@/components/ui/ral-color-box";
import { ListingCard } from "@/components/ui/listing-card";
import { conditionMap, containerTypes, listingTypes, ralColors } from "@/schemas/listingSchema";

type SortByValue = keyof ListingFilters | "popular";

const sortOptions = [
  { value: "addition_date", label: "Дата додавання" },
  { value: "approval_date", label: "Дата затвердження" },
  { value: "updated_at", label: "Дата оновлення" },
  { value: "price", label: "Ціна" },
];

const sortOrders = [
  { value: "asc", label: "За зростанням" },
  { value: "desc", label: "За спаданням" },
];

const locations: Record<string, string> = {
    ua: "Україна",
    nl: "Нідерланди",
};

function App() {
    const [titleFilter, setTitleFilter] = useState("");
    const [containerTypeFilter, setContainerTypeFilter] = useState<string[]>([]);
    const [conditionFilter, setConditionFilter] = useState<string[]>([]);
    const [listingTypeFilter, setListingTypeFilter] = useState<string[]>([]);
    const [locationFilter, setLocationFilter] = useState<string[]>([]);
    const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
    const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
    const [colorFilter, setColorFilter] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<SortByValue>("addition_date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const { data, isLoading, isFetching, refetch } = useListings({
        title: titleFilter || undefined,
        container_type: containerTypeFilter || undefined,
        condition: conditionFilter || undefined,
        type_: listingTypeFilter || undefined,
        location : locationFilter || undefined,
        price_min: priceMin,
        price_max: priceMax,
        ral_color: colorFilter,
        page,
        page_size: 10,
        sort_by: sortBy,
        sort_order: sortOrder,
    });

    const applyFilters = () => {
        setPage(1);
        refetch();
    };
    const colorItems: Record<string, React.ReactNode> = {};
    Object.keys(ralColors).forEach((colorKey) => {
        colorItems[colorKey] = <RalColorBox ralColorKey={colorKey} />;
    });

    return (
        <div
            className="app-root homepage"
            style={{
                backgroundImage: `url(${background})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "100vw",
                height: "100vh",
            }}
        >
            <div className="hero-overlay"/>
            <div className="hero-content">
                <div className="hero-left">
                    <h1 className="hero-title">
                        Cargo<br/>
                        Containers
                    </h1>
                </div>
                <Flex align="center" direction="column">
                    <Text className="hero-desc">
                        Ми збираємо пропозиції з різних сайтів та баз даних,
                        щоб ви могли легко шукати, порівнювати й знаходити найвигідніші варіанти.
                    </Text>
                    <Button className="cta-btn" size="2xl">Аналітика →</Button>
                </Flex>
            </div>

            <div className="main-content">
                <div className="content-container">
                    <aside className="filters-sidebar">
                        <h1 className="filters-title" align="center">Фільтри:</h1>

                        <div className="filter-section">
                            <h2 className="filter-subtitle">Тип</h2>
                            <div className="filter-select-container">
                                <FilterableCheckboxGroup
                                    items={containerTypes}
                                    selected={containerTypeFilter}
                                    onChange={setContainerTypeFilter}
                                />
                            </div>
                        </div>

                        <div className="filter-section">
                            <h2 className="filter-subtitle">Оберіть колір</h2>
                                <FilterableCheckboxGroup
                                    items={colorItems}
                                    selected={colorFilter}
                                    onChange={setColorFilter}
                                />
                        </div>

                        <div className="filter-section">
                            <h2 className="filter-subtitle">Стан</h2>
                            <div className="status-filters">
                                <Fieldset.Root>
                                    <Fieldset.Legend/>
                                    <CheckboxGroup
                                        value={conditionFilter}
                                        onValueChange={(values) => setConditionFilter(values)}
                                    >
                                        <Fieldset.Content>
                                            {Object.entries(conditionMap).map(([key, label]) => (
                                                <Checkbox.Root
                                                    key={key}
                                                    value={key}
                                                >
                                                <Checkbox.HiddenInput />
                                                <Checkbox.Control>
                                                    <Checkbox.Indicator />
                                                </Checkbox.Control>
                                                <Checkbox.Label>{label}</Checkbox.Label>
                                                </Checkbox.Root>
                                            ))}
                                        </Fieldset.Content>
                                    </CheckboxGroup>
                                </Fieldset.Root>
                            </div>
                        </div>

                        {/* Ціна */}
                        <div className="filter-section">
                            <h2 className="filter-subtitle">Мінімальна ціна</h2>
                            <NumberInput.Root 
                                defaultValue={undefined} 
                                onValueChange={(details) => setPriceMin(details.valueAsNumber)}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input value={priceMin} />
                            </NumberInput.Root>
                        </div>
                        <div className="filter-section">
                            <h2 className="filter-subtitle">Максимальна ціна</h2>
                            <NumberInput.Root 
                                defaultValue={undefined}
                                onValueChange={(details) => setPriceMax(details.valueAsNumber)}
                            >
                                <NumberInput.Control />
                                <NumberInput.Input value={priceMax}/>
                            </NumberInput.Root>
                        </div>
                        <div className="filter-section">
                            <h2 className="filter-subtitle">Тип оголошення</h2>
                                <FilterableCheckboxGroup
                                    items={listingTypes}
                                    selected={listingTypeFilter}
                                    onChange={setListingTypeFilter}
                                />
                        </div>
                        <div className="filter-section">
                            <h2 className="filter-subtitle">Локація</h2>
                                <FilterableCheckboxGroup
                                    items={locations}
                                    selected={locationFilter}
                                    onChange={setLocationFilter}
                                />
                        </div>

                        <div className="divider"></div>

                        {/* Apply Button */}
                        <Button alignSelf="center" size="xl" onClick={applyFilters}>Застосувати</Button>
                    </aside>

                    {/* Main Content */}
                    <main className="content-main">
                        <Group attached display="flex" ms="33px" me="33px">
                            <InputGroup startElement={<Search />}>
                                <Input 
                                    size="lg" 
                                    flex="1" 
                                    placeholder="Введіть назву контейнера ..." 
                                    value={titleFilter}
                                    onChange={(e) => setTitleFilter(e.target.value)}
                                />
                            </InputGroup>
                            <Button size="lg" className="search-btn" onClick={applyFilters}>
                                Пошук
                            </Button>
                        </Group>

                        {isLoading || isFetching ? (
                            <Center mt="32px" mb="16px">
                                <Spinner size="xl"/>
                            </Center>
                        ) : (
                            <>
                                <Flex justify="space-between">
                                    <Text className="results-count" textAlign="center" pt="2" pb="2">
                                        Всього знайдено: {data?.total ?? 0}
                                    </Text>

                                    <Flex align="center" gap={2}>

                                        <IconButton
                                            variant="ghost"
                                            onClick={() => {
                                                setSortBy("popular");
                                                setSortOrder("desc");
                                                setPage(1);
                                                void refetch();
                                            }}
                                            title="Популярні оголошення"
                                        >
                                            <ShootingStarSolid
                                                color={sortBy === "popular" ? "gold" : "gray"}
                                                size={22}
                                            />
                                        </IconButton>

                                        <NativeSelect.Root>
                                            <NativeSelect.Field placeholder="Поле сортування" value={sortBy} onChange={(ev) => setSortBy(ev.currentTarget.value as keyof ListingFilters)}>
                                                {sortOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>

                                        <NativeSelect.Root>
                                            <NativeSelect.Field placeholder="Напрям сортування" value={sortOrder} onChange={(ev) => setSortOrder(ev.currentTarget.value as "asc" | "desc")}>
                                                {sortOrders.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </NativeSelect.Field>
                                            <NativeSelect.Indicator />
                                        </NativeSelect.Root>
                                    </Flex>
                                </Flex>

                                <div className="products-grid">
                                    {data?.listings?.map(listing => (
                                        <ListingCard listing={listing}/>
                                    ))}
                                </div>

                                <Center mt="32px" mb="16px">
                                    <Pagination.Root 
                                        count={data?.total ?? 0}
                                        pageSize={data?.page_size ?? 10}
                                        page={data?.page ?? page}
                                        onPageChange={(p) => setPage(p.page)}
                                    >
                                        <ButtonGroup gap="4" size="sm" variant="ghost">
                                            <Pagination.PrevTrigger asChild>
                                                <IconButton>
                                                    <ChevronLeft  />
                                                </IconButton>
                                            </Pagination.PrevTrigger>
                                            <Pagination.PageText />
                                            <Pagination.NextTrigger asChild>
                                                <IconButton>
                                                    <ChevronRight />
                                                </IconButton>
                                            </Pagination.NextTrigger>
                                        </ButtonGroup>
                                    </Pagination.Root>
                                </Center>
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default App;
