import realAxios from 'axios';

export let axios = realAxios;

export function setAxios(axiosInstance) {
  axios = axiosInstance;
}
