import realAxios from 'axios';
import Vue from 'vue';

export function setupAxios({ host, port, sessionId }) {
  return realAxios.create({
    baseURL: `http://${host}:${port}/`,
    headers: {
      Cookie: `connect.sid=${sessionId}`
    }
  });
}

export const axios = Vue.prototype.$axios || realAxios;
