import realAxios from 'axios';

export let axios = realAxios;

export function setupAxios({ host, port }) {
  axios = realAxios.create({
    baseURL: `http://${host}:${port}/`
  });
}
