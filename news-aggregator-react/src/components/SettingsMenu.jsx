import {
    Group,
    LoadingOverlay,
    MultiSelect,
    Navbar,
    NavLink,
    Radio,
    Text,
    useMantineColorScheme
} from "@mantine/core";
import {News, Sun} from "tabler-icons-react";
import {useState} from "react";
import styled from "styled-components";
import {useUser} from "../context/UserProvider.jsx";
import {useQuery} from "@tanstack/react-query";
import ArticleRepository from "../repos/ArticleRepo.js";

export default function SettingsMenu() {
    const [active, setActive] = useState(0);

    const filterDataQuery = useQuery({
        queryKey: ['filtersForSettings'],
        queryFn: () => ArticleRepository.getArticleFilterData(),
    });

    return (
        <SettingsContainer>
            <Navbar width={{base: 200}} height={500} p="xs">
                <NavLink
                    key={'Appearance'}
                    label={'Appearance'}
                    active={active === 0}
                    icon={<Sun size="1.5rem"/>}
                    onClick={() => setActive(0)}
                />
                <Text fz={"sm"} my={"sm"}>Customize feed</Text>
                <NavLink
                    key={'Categories'}
                    label={'Categories'}
                    active={active === 1}
                    icon={<News size="1.5rem"/>}
                    onClick={() => setActive(1)}
                />
                <NavLink
                    key={'Sources'}
                    label={'Sources'}
                    active={active === 2}
                    icon={<News size="1.5rem"/>}
                    onClick={() => setActive(2)}
                />
                <NavLink
                    key={'Keywords'}
                    label={'Keywords'}
                    active={active === 3}
                    icon={<News size="1.5rem"/>}
                    onClick={() => setActive(3)}
                />
            </Navbar>

            <ContentContainer>
                {active === 0 ? (
                    <AppearanceSettings/>
                ) : active === 1 ? (
                    <PreferredSourcesSettings
                        type={'categories'}
                        prefKey={'preferredCategories'}
                        label={'Select categories you are interested in'}
                        filterDataQuery={filterDataQuery}
                    />
                ) : active === 2 ? (
                    <PreferredSourcesSettings
                        type={'origins'}
                        prefKey={'preferredOrigins'}
                        label={'Select origins you are interested in'}
                        filterDataQuery={filterDataQuery}
                    />
                ) : active === 3 ? (
                    <PreferredKeywordsSettings/>
                ) : null}
            </ContentContainer>
        </SettingsContainer>
    );
}

function AppearanceSettings() {
    const {colorScheme} = useMantineColorScheme();
    const {prefs, setPreference} = useUser();

    return <>
        <Radio.Group
            name="theme"
            label="Color scheme"
            value={colorScheme}
            onChange={val => setPreference('colorScheme', val)}
        >
            <Group mt="xs">
                <Radio value="light" label="Light"/>
                <Radio value="dark" label="Dark"/>
            </Group>
        </Radio.Group>

        <Radio.Group
            name="accentColor"
            label="Accent color"
            value={prefs.accentColor}
            onChange={val => setPreference('accentColor', val)}
            mt={"md"}
        >
            <Group mt="xs">
                {['red', 'pink', 'grape', 'violet', 'indigo', 'blue', 'cyan', 'green', 'lime', 'yellow', 'orange', 'teal', 'dark', 'gray']
                    .map((color) =>
                        <Radio
                            value={color}
                            label={color.substring(0, 1).toUpperCase() + color.substring(1)}
                        />
                    )}
            </Group>
        </Radio.Group>
    </>;
}

function PreferredSourcesSettings({type, prefKey, filterDataQuery, label}) {
    const {data, error, isLoading} = filterDataQuery;

    if (error) {
        return <Text>Error loading data</Text>;
    }

    const {prefs, setPreference} = useUser();
    const value = prefs[prefKey] ? prefs[prefKey].split(',') : [];

    return <>
        <LoadingOverlay visible={isLoading} opacity={0.8}/>

        <MultiSelect
            data={data[type]}
            placeholder={type.substring(0, 1).toUpperCase() + type.substring(1)}
            label={label}
            labelProps={{mb: "sm"}}
            searchable
            searchPlaceholder={"Search " + type}
            searchNotFound={"No " + type + " found"}
            nothingFound={"No " + type + " found"}
            mb={"md"}
            value={value}
            onChange={(value) => {
                setPreference(prefKey, value.join(','));
            }}
        />
    </>;
}

function PreferredKeywordsSettings() {
    const {prefs, setPreference} = useUser();
    const value = prefs.preferredKeywords ? prefs.preferredKeywords.split(',') : [];

    return (
        <MultiSelect
            data={value}
            placeholder={"Keywords"}
            label={"Type keywords you prefer to see in your feed"}
            labelProps={{mb: "sm"}}
            searchable
            searchPlaceholder={"Search keywords"}
            searchNotFound={"No keywords found"}
            nothingFound={"No keywords found"}
            mb={"md"}
            creatable
            getCreateLabel={(keyword) => `Add "${keyword}"`}
            value={value}
            onChange={(value) => {
                setPreference('preferredKeywords', value.join(','));
            }}
        />
    );
}

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const ContentContainer = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
  gap: 1em;
`;
