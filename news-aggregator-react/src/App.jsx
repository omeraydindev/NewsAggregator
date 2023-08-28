import './App.css';
import {ColorSchemeProvider, MantineProvider} from "@mantine/core";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import FeedPage from "./pages/FeedPage.jsx";
import {Notifications} from "@mantine/notifications";
import {useToggle} from "@mantine/hooks";

const queryClient = new QueryClient();

function App() {
    dayjs.extend(relativeTime);
    dayjs.extend(duration);

    const [colorScheme, toggleColorScheme] = useToggle(['light', 'dark']);

    return (
        <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS>
            <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
                <QueryClientProvider client={queryClient}>
                    <Notifications/>
                    <FeedPage/>
                </QueryClientProvider>
            </ColorSchemeProvider>
        </MantineProvider>
    )
}

export default App;
