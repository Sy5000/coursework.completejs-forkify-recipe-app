import icons from 'url:../../img/icons.svg'; //use as filepath in html
import View from './View.js';

//challenge - refactor markup generation into method

class PaginationView extends View {
  //define parent to attach methods
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    //event deligation (for both buttons)
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline'); //looks for children element with name
      if (!btn) return; //guard clause

      console.log(btn);

      const goToPage = +btn.dataset.goto; //saved in dataset using html attr (convert from string)

      handler(goToPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    const placeholder = `<span><p></p></span>`;
    const btnNext = `<button data-goto="${
      curPage + 1
    }" class="btn--inline pagination__btn--next">
                <span>${curPage + 1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>`;
    const btnNumPages = `<span class="pagination__pageData">
    <p>${curPage} of ${numPages}</p>
  </span>`;
    const btnPrev = `<button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
          </button>`;
    // console.log(numPages);
    //page 1 + other pages
    if (curPage === 1 && numPages > 1) {
      //   return 'page 1 * others';
      return placeholder + btnNumPages + btnNext;
    }
    //last page
    if (curPage === numPages && numPages > 1) {
      //   return 'last page';
      return btnPrev + btnNumPages + placeholder;
    }
    //Other page
    if (curPage < numPages) {
      //   return 'other page';
      return btnPrev + btnNumPages + btnNext;
    }
    // page 1 no other pages
    return '';
  }
}

export default new PaginationView();
