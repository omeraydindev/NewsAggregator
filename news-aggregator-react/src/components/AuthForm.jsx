import {Anchor, Button, Group, LoadingOverlay, PasswordInput, Text, TextInput} from "@mantine/core";
import React, {useState} from "react";
import {axiosClient} from "../util/axios.js";
import {notifications} from "@mantine/notifications";
import {useForm} from "@mantine/form";
import {useUser} from "../context/UserProvider.jsx";

export default function AuthForm({formType, setFormType, onLogin, onSubmit}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const form = useForm({
        initialValues: {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
        },
    });

    const {prefs} = useUser();

    const toggleFormType = () => {
        setFormType((current) => (current === 'register' ? 'login' : 'register'));
        setError(null);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const routes = {
            login: '/api/sanctum/token',
            register: '/register',
        }

        axiosClient.post(routes[formType], {
            ...form.values,
            device_name: 'browser',
        })
            .then(response => response.data)
            .then(token => {
                if (formType === 'login') {
                    onLogin(token);
                }

                notifications.show({
                    title: 'Success',
                    message: formType === 'register'
                        ? 'Registered successfully, you can now log in'
                        : 'Logged in successfully',
                });
                onSubmit();
                form.reset();
            })
            .catch(err => {
                setError(err?.response?.data?.message ?? err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <LoadingOverlay visible={loading}/>

            {formType === 'register' && (
                <TextInput
                    mt="md"
                    required
                    placeholder="Your name"
                    label="Name"
                    {...form.getInputProps('name')}
                />
            )}

            <TextInput
                mt="md"
                required
                placeholder="Your email"
                label="Email"
                {...form.getInputProps('email')}
            />

            <PasswordInput
                mt="md"
                required
                placeholder="Password"
                label="Password"
                {...form.getInputProps('password')}
            />

            {formType === 'register' && (
                <PasswordInput
                    mt="md"
                    required
                    label="Confirm Password"
                    placeholder="Confirm password"
                    {...form.getInputProps('password_confirmation')}
                />
            )}

            {error && (
                <Text color={prefs.accentColor} size="sm" mt="sm">
                    {error}
                </Text>
            )}

            <Group position="apart" mt="xl">
                <Anchor
                    component="button"
                    type="button"
                    color="dimmed"
                    onClick={toggleFormType}
                    size="sm"
                >
                    {formType === 'register'
                        ? 'Have an account? Login'
                        : "Don't have an account? Register"}
                </Anchor>

                <Button color={prefs.accentColor} type="submit">
                    {formType === 'register' ? 'Register' : 'Login'}
                </Button>
            </Group>
        </form>
    );
}