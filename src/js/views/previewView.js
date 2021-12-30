import View from './View.js';
import icons from '../../img/icons.svg';

///work for resultView and bookmarkView because they are have same html markup; we
//can take advantage of render method; we add another arguments into view render
//function, if we don't pass second argument, it will take default value; we can cut
// render function into two parts

class PreviewView extends View {
  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return ` <li class="preview">
    <a class="preview__link ${
      this._data.id === id ? 'preview__link--active' : ''
    }" href="#${this._data.id}">
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="Test" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${this._data.title}</h4>
        <p class="preview__publisher">${this._data.publisher}</p>
      
        <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      
      
        </div>
    </a>
  </li>`;
  }
}
export default new PreviewView();
