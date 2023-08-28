import {useFeed} from "../context/FeedProvider.jsx";
import {Fragment} from "react";
import Article from "./Article.jsx";
import {Button} from "@mantine/core";
import styled from "styled-components";
import {breakpoints} from "../util/mediaQuery.js";
import {useUser} from "../context/UserProvider.jsx";

export default function FeedList() {
    const {
        query: {
            data,
            error,
            fetchNextPage,
            hasNextPage,
            isFetching,
            isFetchingNextPage,
            status,
        },
    } = useFeed();

    const {prefs} = useUser();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'error') {
        return <div>Error: {error.message}</div>;
    }

    return <>
        <ArticlesGrid>
            {data.pages.map((group, i) => (
                <Fragment key={i}>
                    {group.data.map((article) => (
                        <Article key={article.id} article={article}/>
                    ))}
                </Fragment>
            ))}
        </ArticlesGrid>

        <div>
            <Button
                color={prefs.accentColor}
                mt={"md"}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
            >
                {isFetchingNextPage
                    ? 'Loading more...'
                    : hasNextPage
                        ? 'Load More'
                        : 'Nothing more to load'}
            </Button>
        </div>

        <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>;
};

const ArticlesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 1rem;

  @media (min-width: ${breakpoints.sm}px) {
    & {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: ${breakpoints.md}px) {
    & {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: ${breakpoints.lg}px) {
    & {
      grid-template-columns: repeat(4, 1fr);
    }
  }
`;
