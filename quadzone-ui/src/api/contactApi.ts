import axios from 'axios';

const API_BASE = '/api/v1/contact';

export const sendContact = (data: any) => {
    return axios.post(`${API_BASE}/send`, data);
};
  