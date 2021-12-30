import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import addRecipeView from './views/addRecipeView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';

// controller 需要import from model和view 来达到构建桥梁的作用； modle和view之间不互相import而且也都不需要从controller中import；
// model和view只import config 和helper中的文件，或者bundel过程中需要的文件
// controller 是attached 在html页面上的，所以是load完会自动运行的文件，这就是
//为什么init函数起作用的原因
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //update search result
    // resultView.updat(model.getSearchResultPage()); update typo will make this
    //sync function throw an error //////??????????????????????????????????????????????????????
    resultView.update(model.getSearchResultPage());

    bookmarksView.update(model.state.bookmark);

    // 1)Loading recipe
    await model.loadRecipe(id);
    // 2) Rendering recipe
    recipeView.render(model.state.recipe); //1） 利通过调用view中的方法，来达到同时传递controller中的变量到view中
    //2） 利用模块中的同步特性， 我们可以直接使用model中储存的data
    console.log(model.state.recipe);
  } catch (err) {
    // alert(err);
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    // render spinner
    resultView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) throw new Error('Need input value');

    // console.log(resultView);
    //1) get search query

    //2)Load search rsult
    await model.loadSearch(query);

    //3) render control search
    resultView.render(model.getSearchResultPage()); // 不传入参数，在model中设置默认值为1

    //4) render pagination
    paginationView.render(model.state.search);
    // controlPagination();
  } catch (err) {
    console.log(`${err}@@@@@@`);
    resultView.renderError();
  }
};
//开发pagination的过程中，很多变量我们一开始是从固定量开始的；建立连接后（编码同时利用console一步步打印测试功能）考虑把固定值利用逻辑变量替换
const controlPagination = function (page) {
  // 如果我们在controller中需要使用view中的参数，我们可以通过callback handler 中的arguments；因为
  //利用init函数我们把callback handler attached to dom element； 但是只有dom被操作的时候callback才会被invoked；在被invoked的时候，callback此时接受
  //view中的变量然后运行；利用这种机制我们就可以在callback handler中使用view的变量；
  //1） render New result
  resultView.render(model.getSearchResultPage(page));
  console.log(model.state.recipe);
  //2) render New pagination
  paginationView.render(model.state.search); // 因为getSearchResult中已经把state更新； 所以这里不变
};
//涉及到async function的时候，我们的测试性function call 应该放在async完成后，不然出现错误
const controlServings = function (newServings) {
  model.updateServings(newServings);
  // recipeView.render(model.state.recipe);
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  // only update text and attributes without rerender whole view
};

const controlBookmark = function () {
  // console.log(model.state.recipe); ////////？？？？？？why
  // both console with bookmark in true?
  // console.log(!model.state.recipe.bookmarked);
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else model.deleteBookmark(model.state.recipe);

  recipeView.update(model.state.recipe);

  //3) render bookmarks View
  bookmarksView.render(model.state.bookmark);
};
const controlRenderBookmark = function () {
  bookmarksView.render(model.state.bookmark);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinder
    addRecipeView.renderSpinner();
    //1) receiving data from view
    // console.log(newRecipe);
    //2) pass into model
    await model.addRecipe(newRecipe);
    addRecipeView.renderMessage();
    setTimeout(() => {
      addRecipeView.toggleWindowClass();
      recipeView.render(model.state.recipe);
    }, 2500);
    //render
    bookmarksView.render(model.state.bookmark);
    // changID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.error('********', err.message);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearchResult(controlSearchResult);
  paginationView.addHandlerPageBtn(controlPagination);
  recipeView.addHandlerAddBookmark(controlBookmark);
  bookmarksView.addHandlerRenderBookmark(controlRenderBookmark);
  recipeView.addHandlerUpdateServings(controlServings);
  addRecipeView.addHandlerAddRecipe(controlAddRecipe);
  window.location.hash = '';
};
init();
