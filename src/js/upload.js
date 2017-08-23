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
    response.innerHTML = `<p>${new Date()}: ${xhr.responseText}</p>`;
  };

  return false;
};
