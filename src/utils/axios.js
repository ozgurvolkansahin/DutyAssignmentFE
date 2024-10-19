import axios from 'axios';

const axiosServices = axios.create({ baseURL:  'http://localhost:5184/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('serviceToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401 && !window.location.href.includes('/login')) {
            window.location.pathname = '/login';
        }
        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;

export const fetcher = async (args) => {
    // const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosServices.get(args.url, args.config );

    return res.data;
};

// post
export const poster = async (args) => {
    const res = await axiosServices.post(args.url, args.data, args.config);
    return res.data;
};