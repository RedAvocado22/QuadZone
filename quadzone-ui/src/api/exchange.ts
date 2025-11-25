import API from "./base";

export const getExchangeRate = async (): Promise<number> => {
    const response = await API.get<number>("/public/rate");
    return response.data;
};

