import {axiosClient} from "../util/axios.js";

export default class UserRepository {
    static async getUser() {
        return axiosClient.get('/api/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
        }).then(res => res.data).catch(err => null);
    }

    static async setPreference(key, value) {
        return axiosClient.post('/api/user/prefs', {
            pref_key: key,
            pref_value: value,
        }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        });
    }
}
