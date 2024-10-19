import { fetcher } from '../utils/axios';
export const getDashboard = async (pageNumber, pageSize) => {
    const res = await fetcher({
        url: `/dashboard?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
    return res.data;
}
