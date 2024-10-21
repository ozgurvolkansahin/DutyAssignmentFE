import { fetcher, poster } from '../utils/axios';
export const getPersonnel = async (pageNumber, pageSize) => {
    const res = await fetcher({
        url: `/personnel?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    });
    return res.data;
}
export const getPersonnelDuties = async (sicil, pageNumber, pageSize, isPaidDuties) => {
    const res = await poster({
        url: `/duty/GetDutiesByIdList`,
        config: {
            headers: {
                'Content-Type': 'application/json'
            }
        },
        data: {
            sicil: sicil,
            page: pageNumber+1,
            pageSize: pageSize,
            isPaidDuties: isPaidDuties
        }
    });
    return res.data;
}
