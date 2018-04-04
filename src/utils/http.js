import axios from 'axios';
import Vue from 'vue';

export let http = null;

export function setupHttp(axiosInstance) {
  Vue.prototype.$http = axiosInstance;
  http = axiosInstance;
}

export function setupHttpClient() {
  // const openSnackbar = Vue.prototype.$snackbar.open;
  const openToast = Vue.prototype.$toast.open;

  let axiosInstance = axios.create();

  axiosInstance.interceptors.request.use(config => config, error => {
    openToast({
      message: 'Error: could not complete HTTP request',
      type: 'is-danger'
    });
    return Promise.reject(error);
  });

  axiosInstance.interceptors.response.use(response => {
    const { message } = response.data;
    if (message) {
      openToast({
        message,
        duration: 10000,
        type: 'is-success'
      });
    }
    return response;
  }, error => {
    const { response } = error;

    if (response) {
      const { status } = response;
      const serverMessage = response.data.message;

      const type = serverMessage ? 'is-warning' : 'is-danger';
      const message = serverMessage || `Error during the HTTP request: server responded with ${status} code`;

      openToast({
        message,
        type
      });
    } else {
      openToast({
        message: 'An unexpected error occurred during the HTTP request',
        type: 'is-danger'
      });
    }
    return Promise.reject(error);
  });

  setupHttp(axiosInstance);
}
