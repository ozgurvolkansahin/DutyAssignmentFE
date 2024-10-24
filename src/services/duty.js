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

export const deleteDuty = async (dutyId) => {
    const res = await fetcher({
        url: `/duty/Delete?dutyId=${dutyId}`,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
    return res;
}
