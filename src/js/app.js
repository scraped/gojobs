function Toast(options) {
  let title = options.title || '';
  let message = options.message || '';
  let type = options.type || 'primary';
  this.duration = Math.abs(Number(options.duration)) || 10;

  let notifyDiv = document.createElement('div');
  notifyDiv.classList.add('notification');
  notifyDiv.classList.add(`is-${type}`);
  notifyDiv.hidden = true;

  notifyDiv.addEventListener('click', function(e) {
    let target = e.target;
    if (target.classList.contains('delete')) {
      this.hidden = true;
    }
  });

  let notifyText = '<button class="delete"></button>';
  if (title) notifyText += `<p><b>${title}</b></p>`;
  notifyText += `<p>${message}</p>`;

  notifyDiv.innerHTML = notifyText;
  this.toast = notifyDiv;
}

Toast.prototype.show = function() {
  let toast = this.toast;

  toast.hidden = false;
  document.getElementById('toast-box').appendChild(toast);

  setTimeout(function() {
    toast.hidden = true;
  }, 1000 * this.duration);
};

$(document).ready(function() {
  // JS error notifications
  window.onerror = function(message, url, lineNumber) {
    new Toast({
      title: 'Javascript error occured',
      message: message + "\n(" + url + ":" + lineNumber + ")",
      type: 'danger'
    }).show();
  };

  //*****

  //*****

  // Body margin-top from navbar
  $('body').css('margin-top', $('#navbar').outerHeight());

  //*****

  // Toggle navbar
  $('.navbar-burger').on('click', function() {
    let _this = $(this);

    _this.toggleClass('is-active');
    $(`#${_this.data('target')}`).toggleClass('is-active');
  });

  //*****

  // Loading pages
  let loadJobsListButton = $('#loadJobsList');
  loadJobsListButton.on('click', function() {
    let pageToLoad = Number(loadJobsListButton.data('current-page')) + 1;
    console.log(pageToLoad);
    loadJobsListButton.toggleClass('is-loading');

    $.get(`/?page=${pageToLoad}`, (data, status) => {
      $('#jobsList').append(data);
      loadJobsListButton.toggleClass('is-loading');
      loadJobsListButton.data('current-page', pageToLoad);
    });
  });


  // let form = document.forms.upload;

  // form.onsubmit = function() {
  //   let sendButton = this.elements.send;
  //   const query = 'admin/addcrew?url=' + encodeURIComponent(this.elements.url.value);

  //   let xhr = new XMLHttpRequest();

  //   xhr.open('GET', query, true);
  //   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  //   xhr.send();
  //   sendButton.classList.add('is-loading');

  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState != 4) return;
  //     sendButton.classList.remove('is-loading');
  //     createToast({
  //       title: 'Info',
  //       message: xhr.responseText,
  //       type: 'success'
  //     });
  //   };

  //   return false;
  // };


});

