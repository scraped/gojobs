import realAxios from 'axios';

export let axios = realAxios;

export function setAxiosInstance(axiosInstance) {
  axios = axiosInstance;
}
