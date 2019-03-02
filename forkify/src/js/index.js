import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, elementStrings, renderLoader, clearLoader } from './views/base';

/**GLOBAL APP STATE
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipies
 */
const state = {}

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1. get query from view
    const query = searchView.getInput();

    if(query === '')
        return;

    // 2. new search object and add it to state
    state.search = new Search(query);
    
    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearResults();
    renderLoader(elements.searchRes);

    try {
        // 4. search for recipes
        await state.search.getResults();

        // 5. show results on UI
        clearLoader();
        searchView.renderResults(state.search.result);

    } catch (error) {
        alert(`error processing search : ${error}`);
        console.log(error);
        clearLoader();
    }
};

//event for searching
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//events for selecting a recipe
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest(`.${elementStrings.buttonClass}`);

    if(btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); //convert to base 10 number

        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

/**
 * RECIPE CONTROLLER
 */
const  controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    
    if(id) {
        //prep UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight the select search item
        if(state.search) {
            searchView.highlightSelected(id);
        }

        //create new recipe
        state.recipe = new Recipe(id);

        try {
            //get recipe data and parse the ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //render recipe
            clearLoader();

            //we may not have likes yet if this is 
            //the first time running the page
            let isLiked = false;
            if(state.likes){
                isLiked = state.likes.isLiked(id);
            }

            recipeView.renderRecipe(state.recipe, isLiked);
            
        } catch (error) {
            alert(`error processing recipe : ${error}`);
            console.log(error);
        }       
    }
};

//create an array for all the events on the same window and just add them that way
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * LIST CONTROLLER
 */
const constrolList = () => {
    //create new list if none exist
    if(!state.list) state.list = new List();
    
    //Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(item => {
        const newListItem = state.list.addItem(item.count, item.unit, item.ingredient);
        listView.renderItem(newListItem);
    });
}

/**
 * LIKES CONTROLLER
 */
const controlLike = () => {
    if(!state.likes) state.likes = new Likes();

    //if its not liked yet
    if(!state.likes.isLiked(state.recipe.id)) {
        //add the like to the state
        const newLike = state.likes.addLike(
            state.recipe.id, 
            state.recipe.title, 
            state.recipe.author, 
            state.recipe.img
        );

        //toggle the liked heart
        likesView.toggleLikeBtn(true);

        //add like to UI list
        likesView.renderLike(newLike);

    //if they have already like it
    } else {
        //remove the like to the state
        state.likes.deleteLike(state.recipe.id);

        //toggle the liked heart
        likesView.toggleLikeBtn(false);

        //remove like to UI list
        likesView.deleteLike(state.recipe.id);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore from storage on load
window.addEventListener('load', () => {
    //create a new likes obj and fill it out if any are saved
    state.likes = new Likes();
    state.likes.readStorage();

    //toggle the like icon
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //render any loaded likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

//handle update and delete item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        //remove from state
        state.list.deleteItem(id);

        //remove from list
        listView.deleteItem(id);

    } else if(e.target.matches('.shopping__count-value')) {
        const countValue = parseFloat( e.target.value, 10);
        state.list.updateCount(id, countValue);
    }
});

// recipe button clicks (dont exist on start up, we create the buttons)
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        //decrease button clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        //increase button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        constrolList();

    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
});
