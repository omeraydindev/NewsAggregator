import dayjs from "dayjs";
import styled from "styled-components";
import {useMantineColorScheme, Text} from "@mantine/core";
import {splitCaseInsensitive, stripHtml} from "../util/string.js";
import {useFeedSearch} from "../context/FeedSearchProvider.jsx";
import {breakpoints} from "../util/mediaQuery.js";
import {useUser} from "../context/UserProvider.jsx";

export default function Article({article}) {
    const feedSearchQuery = useFeedSearch().debouncedSearchQuery.trim();
    const {colorScheme} = useMantineColorScheme();
    const {prefs} = useUser();

    const highlightText = (text) => {
        if (!feedSearchQuery) return text;

        const fragments = splitCaseInsensitive(text, feedSearchQuery);
        return fragments.map((part, index) => (
            <span>
                {part}
                {index !== fragments.length - 1 && <mark>{feedSearchQuery}</mark>}
            </span>
        ));
    };

    return (
        <ArticleCard>
            <a href={article.web_url} target={"_blank"}>
                <ArticleImage
                    src={article.image_url}
                    alt={article.title}
                >
                </ArticleImage>
            </a>

            <ArticleTexts>
                <ArticleInfo>
                    <div>{article.category} · {dayjs(article.published_at).fromNow()}</div>
                </ArticleInfo>

                <ArticleTitle
                    href={article.web_url}
                    target={"_blank"}
                    textColor={colorScheme === 'dark' ? 'white' : 'black'}
                >
                    {highlightText(article.title)}
                </ArticleTitle>

                <ArticleDescription>
                    {highlightText(stripHtml(article.description))}
                </ArticleDescription>

                <ArticleSource color={prefs.accentColor}>
                    {article.origin}
                </ArticleSource>
            </ArticleTexts>
        </ArticleCard>
    );
}

const ArticleCard = styled.div`
  display: flex;
  gap: .7em;
  flex-direction: column;
  border-radius: 4px;
  padding: 8px;
  margin-bottom: 8px;
`;

const ArticleImage = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 15px;
  aspect-ratio: 2;

  @media (min-width: ${breakpoints.sm}px) {
    aspect-ratio: 1.8;
  }

  @media (min-width: ${breakpoints.md}px) {
    aspect-ratio: 1.6;
  }

  @media (min-width: ${breakpoints.lg}px) {
    aspect-ratio: 1.2;
  }
`;

const ArticleTexts = styled.div``

const ArticleInfo = styled.div`
  padding-bottom: .7em;
  text-align: start;
`;

const ArticleTitle = styled.a`
  line-height: 1.35em;
  font-size: 1.4em;
  font-weight: bold;
  text-align: start;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-decoration: none;
  color: ${props => props.textColor};
`;

const ArticleDescription = styled.p`
  padding-top: .7em;
  line-height: 1.35em;
  font-size: 1em;
  text-align: start;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
`;

const ArticleSource = styled(Text)`
  padding-top: .7em;
  line-height: 1.35em;
  font-size: 1em;
  text-align: start;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
`;
