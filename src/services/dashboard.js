import { fetcher } from '../utils/axios';
export const getDashboard = async () => {
    const res = await fetcher({
        url: `/dashboard`,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
    return res.data;
}
export const getBranchDashboard = async (pageNumber, pageSize, type) => {
    const res = await fetcher({
        url: `/dashboard/branch?pageNumber=${pageNumber}&pageSize=${pageSize}&type=${type}`,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
    return res.data;
}
