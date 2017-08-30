function createToast(options) {
  let title = options.title || '';
  let message = options.message || '';
  let type = options.type || 'primary';

  document.getElementById('notify-box').innerHTML += `
    <div class="notification is-warning">
      <button class="delete"></button>
      <p><b>${title}</b></p>
      <p>${message}</p>
    </div>
  `;
}

$(document).ready(function() {
  $('.navbar-burger').on('click', function() {
    $(this).toggleClass('is-active');
    $('#' + $(this).data('target')).toggleClass('is-active');
  });

  let form = document.forms.upload;

  form.onsubmit = function() {
    let sendButton = this.elements.send;
    const query = 'admin/addcrew?url=' + encodeURIComponent(this.elements.url.value);

    let xhr = new XMLHttpRequest();

    xhr.open('GET', query, true);
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send();
    sendButton.classList.add('is-loading');

    xhr.onreadystatechange = () => {
      if (xhr.readyState != 4) return;
      sendButton.classList.remove('is-loading');
      createToast({
        title: 'Info',
        message: xhr.responseText,
        type: 'success'
      });
    };

    return false;
  };

});

