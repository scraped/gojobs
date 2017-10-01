export default function Toast(options) {
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
