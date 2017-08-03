let navbarBurger = document.querySelector(".navbar-burger");
let target = document.getElementById(navbarBurger.dataset.target);

navbarBurger.onclick = () => {
  navbarBurger.classList.toggle("is-active");
  target.classList.toggle("is-active");
};

document.getElementById("jobs").onclick = (e) => {
  let target = e.target;

  if (!target.classList.contains("button")) {
    return;
  }

  target.innerHTML = "";
  target.classList.add("is-loading");

  setTimeout(() => {
    target.classList.remove("is-loading");

    if (target.dataset.added == "0") {
      target.dataset.added = "1";
      target.innerHTML = '<img src="/images/delete.png" style="margin-right: 4px"> Remove from bookmarks';
    } else {
      target.dataset.added = "0";
      target.innerHTML = 'Add to bookmarks';
    }
  }, 250);
};
