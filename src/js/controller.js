import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable'; //polyfill everything else
import 'regenerator-runtime/runtime'; //polyfill async/await

//maintain state when dev //parcel code
// if (module.hot) {
//   module.hot.accept();
// }
//
// const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    //take url hash //slice hash symbol
    const id = window.location.hash.slice(1);

    if (!id) return; //guard clause
    //Load animation
    recipeView.renderSpinner();

    //0 results view to mark selected search results (uses update func to only render updated HTML)
    resultsView.update(model.getSearchResultsPage());

    //1 load recipe //store in state obj
    await model.loadRecipe(id);

    //2 render the recipe //pass into render method
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);

    //update bookmarks (cur recipe - active)
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  //retrieve query from VIEW
  const query = searchView.getQuery();
  if (!query) return; //Guard clause

  //Load animation
  resultsView.renderSpinner();

  //execute query/Load results
  await model.loadSearchResults(query);

  //render results
  // console.log('All results', model.state.search.results);

  //pass in data object that needs to be rendered
  // resultsView.render(model.state.search.results); //All results  <--use to filter
  resultsView.render(model.getSearchResultsPage()); //pagination results

  //Render initial pagination buttons //pass in search object
  paginationView.render(model.state.search);
  try {
  } catch (err) {
    console.log(err);
  }
};

controlSearchResults();

const controlPagination = function (goToPage) {
  //render new results
  resultsView.render(model.getSearchResultsPage(goToPage)); //update state to new page
  //render new pagination
  paginationView.render(model.state.search); //pass updated page nr from state obj into render
};
//control model data
const controlServings = function (newServings) {
  //Update the recipe servings
  //create new method (in model)
  // model.updateServings(8); //dev
  model.updateServings(newServings); //recipe stored in state (test)
  //render updated view

  // render (this method updates the entire View each time an action is taken, refactor to update method for precise data load in View)
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked)
    //2 call add bookmark with current recipe (but when... handler?)
    model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //4 check its all working
  // console.log('bkmark click >', model.state.recipe);
  //5 update bookmark icon
  recipeView.update(model.state.recipe);

  //renderbookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    // ..Show loading spinner
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe); //await the async function for errors
    console.log(model.state.recipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //Success msg
    addRecipeView.renderMessage();

    //renderBookmark
    bookmarksView.render(model.state.bookmarks);

    //change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log('⚠️', err);
    addRecipeView.renderError(err.message);
  }
};

//Publisher/subscriber design pattern
const init = function () {
  //functions are passed in as arguments (listen for events before performing)
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerSaveToBookmarks(controlAddBookmark);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings); //view > handler(listen for click) > function (update model and re-render view)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
