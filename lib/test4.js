const axios = require('axios');

const axiosInstance = axios.create();

function openSnackbar({message}) {
  console.log(message)
}

axiosInstance.interceptors.request.use(() => {}, () => {
  openSnackbar({
    message: 'Error: could not complete request',
    type: 'is-danger',
    position: 'is-top'
  });
});

// axiosInstance.interceptors.response.use(response => {
//   openSnackbar({
//     message: response.data.message,
//     duration: 10000,
//     position: 'is-top',
//   });
// }, error => {
//   if (error.response) {
//     openSnackbar({
//       message: 'Internal server error occured',
//       type: 'is-danger',
//       position: 'is-top'
//     });
//   } else {
//     openSnackbar({
//       message: 'An unexpected error occurred during the HTTP request: ' + error,
//       type: 'is-danger',
//       position: 'is-top'
//     });
//     console.log(error);
//   }
// });

(async () => {
  const test = await axiosInstance.get('https://yandex.ru');
  console.log(test);
})();
