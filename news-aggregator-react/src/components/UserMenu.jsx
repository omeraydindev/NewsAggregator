import React, {useEffect, useState} from 'react';
import {
    Menu,
    ActionIcon,
    Modal,
    useMantineColorScheme
} from '@mantine/core';
import {UserCircle, Login, UserPlus, User, Settings, Logout} from 'tabler-icons-react';
import {useDisclosure} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";
import AuthForm from "./AuthForm.jsx";
import SettingsMenu from "./SettingsMenu.jsx";
import {useUser} from "../context/UserProvider.jsx";

export default function UserMenu() {
    const [opened, {open, close}] = useDisclosure(false);
    const [settingsOpened, {open: openSettings, close: closeSettings}] = useDisclosure(false);
    const [formType, setFormType] = useState('register');
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const {currentUser, prefs, refetchUser} = useUser();

    useEffect(() => {
        if (prefs) {
            toggleColorScheme(prefs.colorScheme);
        }
    }, [prefs]);

    const onLogin = (token) => {
        localStorage.setItem('token', token);
        refetchUser();
    };

    const logout = () => {
        localStorage.removeItem('token');
        refetchUser();
        notifications.show({
            title: 'Success',
            message: 'Logged out successfully',
        });
    };

    const IconClass = currentUser ? UserCircle : Login;
    return <>
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <ActionIcon size={"lg"}>
                    <IconClass
                        size={40}
                        strokeWidth={2}
                        color={colorScheme === 'dark' ? 'white' : 'black'}
                    />
                </ActionIcon>
            </Menu.Target>

            {
                currentUser ? (
                    <Menu.Dropdown>
                        <Menu.Label>Logged in</Menu.Label>

                        <Menu.Item
                            icon={<User size={14}/>}
                            disabled
                        >{currentUser.name}</Menu.Item>

                        <Menu.Item
                            icon={<Settings size={14}/>}
                            onClick={openSettings}
                        >Settings</Menu.Item>

                        <Menu.Item
                            icon={<Logout size={14}/>}
                            onClick={logout}
                        >Logout</Menu.Item>
                    </Menu.Dropdown>
                ) : (
                    <Menu.Dropdown>
                        <Menu.Label>User</Menu.Label>

                        <Menu.Item
                            icon={<Login size={14}/>}
                            onClick={() => {
                                setFormType('login');
                                open();
                            }}
                        >Login</Menu.Item>

                        <Menu.Item
                            icon={<UserPlus size={14}/>}
                            onClick={() => {
                                setFormType('register');
                                open();
                            }}
                        >Register</Menu.Item>
                    </Menu.Dropdown>
                )
            }
        </Menu>

        <Modal opened={opened} onClose={close} title="Authentication" centered>
            <AuthForm
                formType={formType}
                setFormType={setFormType}
                onLogin={onLogin}
                onSubmit={close}
            />
        </Modal>

        <Modal opened={settingsOpened} onClose={closeSettings} title="Settings" centered size="lg">
            <SettingsMenu/>
        </Modal>
    </>;
}