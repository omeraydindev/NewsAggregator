import React, {useState} from 'react';
import ArticleRepository from "../repos/ArticleRepo.js";
import {useInfiniteQuery} from "@tanstack/react-query";
import {useFeedSearch} from "./FeedSearchProvider.jsx";
import {useUser} from "./UserProvider.jsx";

const FeedContext = React.createContext({});
export const useFeed = () => React.useContext(FeedContext);

export const FeedProvider = ({children}) => {
    const [filters, setFilters] = useState({
        categories: [],
        origins: [],
        date_range: [null, null],
    });

    const {debouncedSearchQuery} = useFeedSearch();

    const {prefs} = useUser();

    const query = useInfiniteQuery({
        queryKey: ['articles', filters, debouncedSearchQuery,
            prefs.preferredCategories, prefs.preferredOrigins, prefs.preferredKeywords],
        queryFn: fetchArticles,
        getNextPageParam: (lastPage) => lastPage.next_page_url,
    });

    async function fetchArticles({queryKey, pageParam}) {
        const params = new URLSearchParams();
        let [_, filters, searchQuery,
            preferredCategories, preferredOrigins, preferredKeywords] = queryKey;

        if (searchQuery) {
            params.set('q', searchQuery);
        }

        preferredCategories = preferredCategories ? preferredCategories.split(',') : [];
        const filteredCategories = filters?.categories || [];
        const categories = [...new Set(filteredCategories.concat(preferredCategories))];
        if (categories.length > 0) {
            params.set('categories', categories.join(','));
        }

        preferredOrigins = preferredOrigins ? preferredOrigins.split(',') : [];
        const filteredOrigins = filters?.origins || [];
        const origins = [...new Set(filteredOrigins.concat(preferredOrigins))];
        if (origins.length > 0) {
            params.set('origins', origins.join(','));
        }

        preferredKeywords = preferredKeywords ? preferredKeywords.split(',') : [];
        if (preferredKeywords.length > 0) {
            params.set('keywords', preferredKeywords.join(','));
        }

        if (filters?.date_range && filters?.date_range[0] && filters?.date_range[1]) {
            params.set('date_range', filters?.date_range?.map(e => ~~(e.getTime() / 1000)));
        }

        return ArticleRepository.getArticles(pageParam, params);
    }

    return (
        <FeedContext.Provider value={{
            query,
            filters,
            setFilters,
        }}>
            {children}
        </FeedContext.Provider>
    );
}
