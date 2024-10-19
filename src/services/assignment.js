import { fetcher } from '../utils/axios';
export const getAssignments = async () => {
    const res = await fetcher({
        url: '/assignments',
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
    return res;
}
export const assignToDuty = async (data) => {
    const res = await ({
        url: '/assignment/SelectPersonalToBePaid',
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        },
        data
    });
    return res;
}
