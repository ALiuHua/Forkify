import icons from '../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './View.js';

class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');
  _errorMessage = 'Could not find the recipe, please try another one';
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }
  addHandlerUpdateServings(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;
      // console.log(btn);
      // console.log(btn.dataset);
      //1) dataset will return a object;
      //2)<data-update-to> in HTML will be transformed into updateTo (every dash will transfored into uppercase)
      const { updateTo } = btn.dataset;
      // console.log(updateTo);
      if (+updateTo > 0) handler(+updateTo);
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
  _generateMarkup() {
    return `
        <figure class="recipe__fig">
        <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
        <h1 class="recipe__title">
            <span>${this._data.title}</span>
        </h1>
        </figure>

        <div class="recipe__details">
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
            <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
            <button class="btn--tiny btn--update-servings" data-update-to = "${
              this._data.servings - 1
            }">
                <svg>
                <use href="${icons}#icon-minus-circle"></use>
                </svg>
            </button>
            <button class="btn--tiny btn--update-servings" data-update-to = "${
              this._data.servings + 1
            }">
                <svg>
                <use href="${icons}#icon-plus-circle"></use>
                </svg>
            </button>
            </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
        <button class="btn--round btn--bookmark">
            <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
        </button>
        </div>

        <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
            <ul class="recipe__ingredient-list">
        ${this._data.ingredients
          .map(this._generateMarkupIngredient)
          // this will work; because what's in map method is callback function who take ing
          //value as argument
          //   .map(ing => {
          //     console.log(this);
          //     this.#generateMarkupIngredient(ing);
          //   }) //this will work;this keyword in arrow function should look up in out scope
          //   .map(function (ing) {
          //     console.log(this);
          //     this.#generateMarkupIngredient(ing);
          //   })// this won't work because in this case; this is in callback function, this
          // keyword will be undefined
          .join('')}
            </ul>
        </div>

        <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe_publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
        </p>
        <a
            class="btn--small recipe__btn"
            href="${this._data.source}"
            target="_blank"
        >
            <span>Directions</span>
            <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </a>
        </div>`;
  }

  _generateMarkupIngredient(ing) {
    return `
        <li class="recipe__ingredient">
            <svg class="recipe__icon">
                <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${
                  ing.quantity ? new Fraction(ing.quantity).toString() : ''
                }</div>
                <div class="recipe__description">
                <span class="recipe__unit">${ing.unit}</span>
                ${ing.description}
                </div>
                </li>
                `;
  }
}

export default new RecipeView();
