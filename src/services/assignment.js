import { fetcher, poster } from '../utils/axios';
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
export const getPaidAssignments = async (pageNumber, pageSize) => {
    const res = await fetcher({
        url: `/assignment/PaidAssignments?pageNumber=${pageNumber}&pageSize=${pageSize}`,
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
export const getAssignedPersonalByDutyIdWithPagination = async (dutyId,page,pageSize) => {
    const res = await poster({
        url: '/assignment/GetAssignedPersonalByDutyIdWithPagination',
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        },
        data: {
            dutyId,
            page,
            pageSize
    }});
    return res;
}
