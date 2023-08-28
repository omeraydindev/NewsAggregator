import React, {useState} from "react";
import {useDebouncedValue} from "@mantine/hooks";

const FeedSearchContext = React.createContext('');
export const useFeedSearch = () => React.useContext(FeedSearchContext);

export const FeedSearchProvider = ({children}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 500, {leading: true});

    return (
        <FeedSearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            debouncedSearchQuery,
        }}>
            {children}
        </FeedSearchContext.Provider>
    );
};
