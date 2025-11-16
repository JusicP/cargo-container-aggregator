import background from "@/assets/background.png";
import '@/pages/homepage/homepage.css'
import container from "@/assets/container.png";
import { Button, ButtonGroup, Center, Checkbox, CheckboxGroup, Fieldset, Flex, Group, IconButton, Input, InputGroup, NativeSelect, NumberInput, Pagination, Text } from "@chakra-ui/react";
import { ArrowUpRight, ChevronLeft, ChevronRight, Search } from "@mynaui/icons-react";
import { useListings, type ListingFilters } from "@/services/api/listings";
import { useState } from "react";
import FilterableCheckboxGroup from "@/components/ui/filterable-checkbox-group";

import { RAL } from "ral-colors/index"
import RalColorBox from "@/components/ui/ral-color-box";


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

const conditionMap: Record<string, string> = {
    new: "Новий",
    used: "Б/В",
    restored: "Відновлений",
};

const containerTypes: Record<string, string> = {
  standard: "Standard",
  high_cube: "High Cube",
  reefer: "Reefer",
  open_top: "Open Top",
  open_side: "Open Side",
  flat_rack: "Flat Rack",
  double_door: "Double Door",
  tank: "Tank",
  other: "Інший",
};

const listingTypes: Record<string, string> = {
  sale: "Продаж",
  rent: "Оренда",
};

const ralColors: Record<string, string> = {
    RAL1000: "Зеленувато-бежевий",
    RAL1001: "Бежевий",
    RAL1002: "Піщаний жовтий",
    RAL1003: "Сигнальний жовтий",
    RAL1004: "Золотисто-жовтий",
    RAL1005: "Жовтий медовий",
};

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
    const [sortBy, setSortBy] = useState<keyof ListingFilters>("addition_date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const { data: listings, isLoading, refetch } = useListings({
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

                        <Flex justify="space-between">
                            <Text className="results-count" textAlign="center" pt="2" pb="2">
                                Всього знайдено: {listings?.length ?? 0}
                            </Text>

                            <Flex align="center" gap={2}>
                                <NativeSelect.Root value={sortBy} onValueChange={(val) => setSortBy(val as keyof ListingFilters)}>
                                    <NativeSelect.Field placeholder="Поле сортування">
                                        {sortOptions.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                    </NativeSelect.Root>

                                    <NativeSelect.Root value={sortOrder} onValueChange={(val) => setSortOrder(val as "asc" | "desc")}>
                                    <NativeSelect.Field placeholder="Напрям сортування">
                                        {sortOrders.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </NativeSelect.Field>
                                    <NativeSelect.Indicator />
                                </NativeSelect.Root>
                            </Flex>
                        </Flex>

                        <div className="products-grid">
                            {listings?.map(listing => (
                                <div key={listing.id} className="product-card">
                                    <img
                                        src={container}
                                        alt="Container"
                                        className="product-image"
                                    />
                                    <div className="product-info">
                                        <p className="product-title">
                                            {listing.title}
                                        </p>
                                        <IconButton size="md" paddingRight={7} paddingLeft={7}><ArrowUpRight/></IconButton>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Center mt="32px" mb="16px">
                            <Pagination.Root 
                                count={10} 
                                pageSize={10} 
                                page={page}
                                onChange={(p) => setPage(p)}
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
                    </main>
                </div>
            </div>
        </div>
    );
}

export default App;
