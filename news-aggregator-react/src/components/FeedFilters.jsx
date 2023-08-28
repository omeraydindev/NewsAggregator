import {Button, MultiSelect, Popover, Text} from "@mantine/core";
import {DatePickerInput} from '@mantine/dates';
import {Filter} from "tabler-icons-react";
import styled from "styled-components";
import {useQuery} from "@tanstack/react-query";
import {useFeed} from "../context/FeedProvider.jsx";
import ArticleRepository from "../repos/articleRepo.js";
import {useUser} from "../context/UserProvider.jsx";

export default function FeedFilters() {
    const {filters, setFilters} = useFeed();

    const {data, error, isLoading} = useQuery({
        queryKey: ['filters'],
        queryFn: () => ArticleRepository.getArticleFilterData(),
    });

    const {query: {data: feedData}} = useFeed();

    const {prefs} = useUser();

    const filterCount = [
        filters.categories.length > 0,
        filters.origins.length > 0,
        filters.date_range[0] && filters.date_range[1]
    ].filter(Boolean).length;

    const renderFilterInputs = () => (
        <FilterInputsContainer>
            <Text color={prefs.accentColor} fw={"bold"} size={"lg"} mb={"md"}>Filters</Text>

            <MultiSelect
                data={data.categories}
                placeholder={"Category"}
                label={"Category"}
                searchable
                searchPlaceholder={"Search category"}
                searchNotFound={"No category found"}
                nothingFound={"No category found"}
                clearable
                mb={"md"}
                value={filters.categories}
                onChange={(value) => {
                    setFilters(old => ({...old, categories: value}));
                }}
            />
            <MultiSelect
                data={data.origins}
                placeholder={"Origin"}
                label={"Origin"}
                searchable
                searchPlaceholder={"Search origin"}
                searchNotFound={"No origin found"}
                nothingFound={"No origin found"}
                clearable
                mb={"md"}
                value={filters.origins}
                onChange={(value) => {
                    setFilters(old => ({...old, origins: value}));
                }}
            />
            <DatePickerInput
                type="range"
                label="Date range"
                placeholder="Pick date range"
                value={filters.date_range}
                onChange={(value) => {
                    setFilters(old => ({...old, date_range: value}));
                }}
                mb={"md"}
            />
        </FilterInputsContainer>
    );

    return (
        <FilterContainer>
            <CountText>
                {feedData?.pages?.[0]?.total ?? '0'} articles found
            </CountText>

            <Popover width={500} position="bottom-end" withArrow shadow="md">
                <Popover.Target>
                    <Button color={prefs.accentColor} leftIcon={<Filter/>} variant="outline">
                        {filterCount > 0 ? `Filter (${filterCount})` : 'Filter'}
                    </Button>
                </Popover.Target>
                <Popover.Dropdown>
                    {isLoading ?
                        <div>Loading...</div>
                        : error ?
                            <div>Error: {error.message}</div>
                            : data ?
                                renderFilterInputs()
                                : undefined}
                </Popover.Dropdown>
            </Popover>
        </FilterContainer>
    );
}

const CountText = styled(Text)`
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1em;
  padding-left: 1.2em;
  padding-right: 1.2em;
`;

const FilterInputsContainer = styled.div`
  text-align: start;
`;
