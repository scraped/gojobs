import axios from 'axios';
import Vue from 'vue';

export let http = null;

export function setupHttp(axiosInstance) {
  Vue.prototype.$http = axiosInstance;
  http = axiosInstance;
}

export function setupHttpClient() {
  const openSnackbar = Vue.prototype.$snackbar.open;

  let axiosInstance = axios.create({
    timeout: 7000
  });

  axiosInstance.interceptors.request.use(config => config, error => {
    openSnackbar({
      message: 'Error: could not complete request',
      type: 'is-danger',
      position: 'is-top'
    });
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use(response => {
    const message = response.data.message;
    if (message) {
      openSnackbar({
        message,
        duration: 10000,
        position: 'is-top',
      });
    }
    return response;
  }, error => {
    if (error.response) {
      openSnackbar({
        message: 'Internal server error occured',
        type: 'is-danger',
        position: 'is-top'
      });
    } else {
      openSnackbar({
        message: 'An unexpected error occurred during the HTTP request',
        type: 'is-danger',
        position: 'is-top'
      });
    }
    return Promise.reject(error);
  });

  setupHttp(axiosInstance);
}
