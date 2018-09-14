import axios from 'axios';
import Vue from 'vue';

export function setupHttpService({http}) {
  Vue.prototype.$http = http;
  return Vue.prototype.$http;
}

export function setupHttpClient() {
  const axiosInstance = setupHttpService({
    http: axios.create({
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
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
      const {message} = response.data;
      if (message) {
        openToast({
          message,
          duration: 10000,
          type: 'is-success',
          position: 'is-top-right'
        });
      }
      return response;
    },

    error => {
      const {response} = error;

      if (response) {
        const {status} = response;
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
          position: 'is-top-right'
        });
      }
      return Promise.reject(error);
    }
  );
}
