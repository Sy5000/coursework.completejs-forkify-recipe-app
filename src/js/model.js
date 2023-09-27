// import { isInteger } from 'core-js/core/number';
// import create from 'core-js/library/fn/object/create';
import { API_URL, RES_PER_PAGE, KEY } from './config';
// import { getJSON, sendJSON } from './helpers';
import { AJAX } from './helpers';

//pass to controller
//empty objects to be populated by api data
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  fullRecipes: [],
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    sourceURL: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    //short circuit //conditionally add property to object
    ...(recipe.key && { key: recipe.key }),
  };
};

//manipulate state
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);
    //Format result //New object

    //check if recipe is in bookmark array
    //loop array return true if T or default to F
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    //Temp error handling
    console.error(`${err} CUSTOM 🏹 ERROR `);
    throw err;
  }
};

// export const loadFullRecipes = async function (id) {
//   try {
//     const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
//     return createRecipeObject(data);
//   } catch (err) {
//     //Temp error handling
//     console.error(`${err} CUSTOM 🏹 ERROR `);
//     throw err;
//   }
// };

export const loadSearchResults = async function (query) {
  try {
    //perform search normally

    //take id from each result

    //fetch further details with API (servings and cooking time) - forEach

    //add to array or create new array??

    //render results to view on command

    //API
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    //map results //save to state
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        image: rec.image_url,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
    console.log('use ids from here', state.search.results);

    // state.search.results.forEach(rec => {
    //   state.fullRecipes.push(rec.id);
    // });

    // state.search.results.forEach(rec => {
    //   state.fullRecipes.push(rec.id);
    // });

    console.log(state.fullRecipes);

    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};
// loadSearchResuls('pizza');

// export const loadSearchResults = async function (query) {
//   try {
//     //API
//     const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
//     //map results //save to state
//     state.search.results = data.data.recipes.map(rec => {
//       return {
//         id: rec.id,
//         title: rec.title,
//         image: rec.image_url,
//         publisher: rec.publisher,
//         ...(rec.key && { key: rec.key }),
//       };
//     });
//     console.log('', state.search.detailedResults);
//     state.search.page = 1;
//   } catch (err) {
//     throw err;
//   }
// };
// loadSearchResuls('pizza');

//pagination //pass in page nr (page = 'how to set default')
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page; //save to state
  //calculate each page result range dynamically
  const start = (page - 1) * state.search.resultsPerPage; //eg page 1 (s:1- e:10) page 2(s:11- e:20)
  const end = page * state.search.resultsPerPage; //link to state data
  //search results from state
  return state.search.results.slice(start, end);
};

// method available to controller (servings will be passed in)
export const updateServings = function (newServings) {
  //manipulte the data in from the state object (loop for multiple ingredients)
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // newQty = oldQty * newServings / oldServings // 2 * 8 / 4 = 4
  });
  //update the servings to reflect input
  //outside func to access old servings in func
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //1 add recipe to bookmarks array in state object (which recipe controller?)
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  //delete from bookmarks array using id
  const index = state.bookmarks.findIndex(el => {
    el.id === id;
  }); //find index === id passed in

  state.bookmarks.splice(index, 1); //index to remove //# of elements to remove

  //remove from view
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage); //convert from string - obj
};

init();

// console.log('from local storage ', state.bookmarks);

//dev only
// const clearBookmarks = function () {
//   localStorage.clear('bookmarks');
// };
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  try {
    //take data object (created by form) //filter empty fields/ingredients
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        //map to new obj
        //qty convert to # or null

        const ingArr = ing[1].replaceAll(' ', '').split(',');

        if (ingArr.length !== 3)
          throw new Error('Wrong ingredient format! Please try again!');

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    console.log(recipe);
    //send API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data); //api result
    state.recipe = createRecipeObject(data); //use func to format data to app
    addBookmark(state.recipe);
  } catch (err) {
    //async = uncought promise err //try catch block to throw err to correct block
    throw err;
  }
};
