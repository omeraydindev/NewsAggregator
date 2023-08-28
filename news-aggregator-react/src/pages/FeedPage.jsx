import FeedFilters from "../components/FeedFilters.jsx";
import FeedList from "../components/FeedList.jsx";
import UserProvider from "../context/UserProvider.jsx";
import FeedHeader from "../components/FeedHeader.jsx";
import {FeedProvider} from "../context/FeedProvider.jsx";
import {FeedSearchProvider} from "../context/FeedSearchProvider.jsx";

export default function FeedPage() {
    return (
        <UserProvider>
            <FeedSearchProvider>
                <FeedProvider>
                    <FeedHeader/>
                    <FeedFilters/>
                    <FeedList/>
                </FeedProvider>
            </FeedSearchProvider>
        </UserProvider>
    );
}
