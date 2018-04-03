import axios from 'axios';
import Vue from 'vue';

export let http = null;

export function setupHttp(axiosInstance) {
  Vue.prototype.$http = axiosInstance;
  http = axiosInstance;
}

export function setupHttpClient() {
  const openSnackbar = Vue.prototype.$snackbar.open;
  const openToast = Vue.prototype.$toast.open;

  let axiosInstance = axios.create();

  axiosInstance.interceptors.request.use(config => config, error => {
    openSnackbar({
      message: 'Error: could not complete HTTP request',
      type: 'is-danger',
      position: 'is-top'
    });
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use(response => {
    const message = response.data.message;
    if (message) {
      openToast({
        message,
        duration: 10000,
        type: 'is-success',
        position: 'is-top',
      });
    }
    return response;
  }, error => {
    if (error.response) {
      const { status } = error.response;
      openSnackbar({
        message: `Error: server responded with ${status} code`,
        type: 'is-danger',
        position: 'is-bottom-left'
      });
    } else {
      openSnackbar({
        message: 'An unexpected error occurred during the HTTP request',
        type: 'is-danger',
        position: 'is-bottom-left'
      });
    }
    return Promise.reject(error);
  });

  setupHttp(axiosInstance);
}
