import React, {useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import UserRepository from "../repos/UserRepo.js";

export const UserContext = React.createContext({});
export const useUser = () => React.useContext(UserContext);

const defaultPrefs = Object.freeze({
    colorScheme: 'light',
    accentColor: 'red',
});

export default function UserProvider({children}) {
    const {
        data: currentUser,
        refetch: refetchUser,
    } = useQuery({
        queryKey: ['user'],
        queryFn: () => UserRepository.getUser(),
    });

    const prefs = useMemo(() => {
        const userPrefs = Object.fromEntries(
            currentUser?.prefs.map(p => [p.pref_key, p.pref_value]) || []);

        return {...defaultPrefs, ...userPrefs};
    }, [currentUser]);

    const setPreference = (key, value) => {
        UserRepository.setPreference(key, value)
            .then(() => refetchUser());
    };

    return (
        <UserContext.Provider value={{currentUser, refetchUser, prefs, setPreference}}>
            {children}
        </UserContext.Provider>
    );
}
