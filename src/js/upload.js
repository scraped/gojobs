let form = document.forms.upload;

form.onsubmit = function() {
  let sendButton = this.elements.send;
  const query = '?link=' + encodeURIComponent(this.elements.link.value);

  let xhr = new XMLHttpRequest();

  xhr.open('GET', query, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.send();
  sendButton.classList.add("is-loading");

  xhr.onreadystatechange = () => {
    if (xhr.readyState != 4) return;
    sendButton.classList.remove("is-loading");
    response.innerHTML += `<p>${xhr.responseText}</p>`;
  };

  return false;
};
