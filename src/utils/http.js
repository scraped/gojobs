import config from '@/../config'
import axios from 'axios';
import Vue from 'vue';
import {serializeCookies} from '@/utils';

export let http = null;

function setupHttp(axiosInstance) {
  Vue.prototype.$http = axiosInstance;
  http = axiosInstance;
}

export function setupHttpServer(req) {
  const axiosInstance = axios.create({
    baseURL: `http://${req.hostname}:${config.port}/`,
    headers: {
      Cookie: serializeCookies(req.cookies),
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  setupHttp(axiosInstance);
}

export function setupHttpClient() {
  let axiosInstance = axios.create({
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    }
  });

  const openToast = Vue.prototype.$snackbar.open;
  // const openToast = Vue.prototype.$toast.open;

  axiosInstance.interceptors.request.use(
    config => config,
    error => {
      openToast({
        message: 'Error: could not complete HTTP request',
        type: 'is-danger'
      });
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    response => {
      const { message } = response.data;
      if (message) {
        openToast({
          message,
          duration: 10000,
          type: 'is-success'
        });
      }
      return response;
    },
    error => {
      const { response } = error;

      if (response) {
        const { status } = response;
        const serverMessage = response.data.message;

        const type = serverMessage
          ? 'is-warning'
          : 'is-danger';

        const message = serverMessage
          || `Error: server responded with ${status} code`;

        openToast({
          message,
          type,
          position: 'is-top-right'
        });
      } else {
        openToast({
          message: 'Error: could not complete HTTP request',
          type: 'is-danger',
          position: 'is-bottom'
        });
      }
      return Promise.reject(error);
    }
  );

  setupHttp(axiosInstance);
}
