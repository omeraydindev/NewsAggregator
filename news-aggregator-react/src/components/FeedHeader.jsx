import {ActionIcon, TextInput, useMantineColorScheme, Text} from "@mantine/core";
import {Search, X} from "tabler-icons-react";
import UserMenu from "./UserMenu.jsx";
import {useRef, useState} from "react";
import styled from "styled-components";
import {useFeedSearch} from "../context/FeedSearchProvider.jsx";
import {useUser} from "../context/UserProvider.jsx";

export default function FeedHeader() {
    const [inSearchMode, setInSearchMode] = useState(false);
    const searchInputRef = useRef();

    const {searchQuery, setSearchQuery} = useFeedSearch();

    const {prefs} = useUser();

    const {colorScheme} = useMantineColorScheme();

    return <>
        {inSearchMode ? (
            <SearchContainer>
                <TextInput
                    ref={searchInputRef}
                    placeholder="Search here..."
                    variant="filled"
                    radius="xl"
                    size="lg"
                    w={'100%'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.currentTarget.value)}
                    rightSection={
                        <ActionIcon
                            variant="transparent"
                            onClick={() => {
                                setInSearchMode(false);
                                setSearchQuery('');
                            }}
                        >
                            <X
                                size={40}
                                strokeWidth={2}
                                color={colorScheme === 'dark' ? 'white' : 'black'}
                            />
                        </ActionIcon>
                    }
                />
            </SearchContainer>
        ) : (
            <Toolbar>
                <FeedTitle color={prefs.accentColor}>Feed</FeedTitle>

                <IconsContainer>
                    <ActionIcon
                        size={"lg"}
                        onClick={() => {
                            setInSearchMode(true);
                            setTimeout(() => searchInputRef.current.focus(), 100);
                        }}
                    >
                        <Search
                            size={40}
                            strokeWidth={2}
                            color={colorScheme === 'dark' ? 'white' : 'black'}
                        />
                    </ActionIcon>
                    <UserMenu/>
                </IconsContainer>
            </Toolbar>
        )}
    </>;
}

const SearchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2em 1.2em 1.6em;
`;

const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.2em;
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.75em;
`;

const FeedTitle = styled(Text)`
  text-align: start;
  font-size: 2em;
  font-weight: bold;
  padding-top: 1em;
  padding-bottom: 1em;
`;
