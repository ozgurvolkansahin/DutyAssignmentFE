import { fetcher } from '../utils/axios';
export const insertDuties = async () => {
    const res = await fetcher({
        url: '/duty/InsertDuties',
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
    return res;
}
