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




  // Left menu fixation
  const leftmenu = document.getElementById('left-menu');
  const leftmenuBottomPageCoord = 91; window.pageYOffset + leftmenu.offsetHeight;

  document.onscroll = function(e) {
    const isFixed = leftmenu.classList.contains("menu-fixed");

    if (!isFixed && window.pageYOffset >= leftmenuBottomPageCoord
      || isFixed && window.pageYOffset <= leftmenuBottomPageCoord) {
        leftmenu.style.width = leftmenu.offsetWidth + 'px';
        leftmenu.classList.toggle("menu-fixed");
    }
  };

});

