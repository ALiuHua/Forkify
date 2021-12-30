import { async } from 'regenerator-runtime'; //why they are here.
import { API_URL, RES_PER_PAGE, API_KEY } from './config.js';
// import { getJSON, sendJSON } from './helper.js';
import { AJAX } from './helper.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};

const createRecipe = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    source: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);
    state.recipe = createRecipe(data);

    if (state.bookmark.some(recipe => recipe.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(err);
    // state.error = err.message;
    throw err;
  }
};

export const loadSearch = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

// export const getSearchResultPage = function (page = 1) {
export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;

  return state.search.result.slice(start, end);
};

export const updateServings = function (newServings) {
  // console.log(state.recipe);
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings; // this servings should be updated only after forEach loop finished;
  //otherwise will ocurr error causing only first value been changed
};
const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  state.bookmark.push(recipe);
  state.recipe.bookmarked = true;
  persistBookmark();
};

export const deleteBookmark = function (id) {
  state.recipe.bookmarked = false;
  const index = state.bookmark.findIndex(recipe => recipe.id === id);
  state.bookmark.splice(index, 1);
  persistBookmark();
};
export const addRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        // 找出需要的array
        entry =>
          entry[0].replace(' ', '').startsWith('ingredient') && entry[1] !== ''
      )
      .map(ing => {
        const ingredientArr = ing[1].replaceAll(' ', '').split(',');
        if (ingredientArr.length !== 3)
          // 验证条件，是否输入三个值
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingredientArr;

        return { quantity: quantity ? +quantity : null, unit, description }; //把array in array转换成object in array
      }); // 对象的值可以是计算值 tenary expression

    const recipe = {
      // id: newRecipe.id,
      cooking_time: +newRecipe.cookingTime,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
      ingredients,
    };

    const data = await AJAX(`${API_URL}/?key=${API_KEY}`, recipe);
    state.recipe = createRecipe(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();
