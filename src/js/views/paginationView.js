import View from './View.js';
import icons from '../../img/icons.svg';
import { RES_PER_PAGE } from '../config.js';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerPageBtn(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      // when we need to use event propogating and closest method
      // if the event handler deal with same type of event; we can use event propogating to make thing eaiser
      // if the target we want has child elements, wen need to use closest method;in this case span element
      // e.target : where event orginated   e.currentTarget: event handler attached to
      if (!btn) return;

      //1）How do we established connection to receive dada between DOM and code?
      //1) we can use <data-togo = '3'> ie: data attritubes in html and element.dataset.togo to transfer
      //1) in this case we can get page number in dom by user click
      //1） any value we got from dom is string, that's why it's in white in console
      handler(+btn.dataset.togo);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;

    const pageNum = Math.ceil(this._data.result.length / RES_PER_PAGE);

    //1) First page, there still other page
    if (currentPage === 1 && pageNum > 1) {
      return `
        <button data-togo=${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
    //2) last page, there still other page
    if (currentPage === pageNum && pageNum > 1) {
      return `
        <button data-togo=${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
        <span>Page ${currentPage - 1}</span>
        </button>`;
    }
    //3) other page
    if (currentPage > 1) {
      return `
        <button data-togo=${
          currentPage - 1
        } class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
            </svg>
        <span>Page ${currentPage - 1}</span>
        </button>
        <button data-togo=${
          currentPage + 1
        } class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
    //4 only one page

    return '';
  }
}
export default new PaginationView();
