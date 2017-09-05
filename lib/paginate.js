module.exports = paginate;

function paginate(pagesAmount, currPage) {
  let pages = [];

  if (pagesAmount <= 9) {

    for (let i = 0; i < pagesAmount; i++) {
      pages[i] = { page: i + 1 }
    }

  } else if (currPage <= 3 || currPage >= (pagesAmount - 2)) {

    pages = [
      { page: 1 },
      { page: 2 },
      { page: 3 },
      { page: 4 },
      { page: 0 },
      { page: pagesAmount - 3 },
      { page: pagesAmount - 2 },
      { page: pagesAmount - 1 },
      { page: pagesAmount },
    ]
  } else {
    pages = [
      { page: 1 },
      { page: 2 },
      { page: 0 },
      { page: currPage - 1 },
      { page: currPage },
      { page: currPage + 1 },
      { page: 0 },
      { page: pagesAmount - 1 },
      { page: pagesAmount },
    ]
  }

  pages.forEach(page => {
    page.isCurrent = (page.page === currPage);
  })

  return pages;
}
