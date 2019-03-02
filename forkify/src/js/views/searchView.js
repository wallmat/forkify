import { elements, elementStrings } from './base';

/**
 * gets the input value from the search field
 */
export const getInput = () => elements.searchInput.value;

/**
 * clears the search input
 */
export const clearInput = () => {
    elements.searchInput.value = '';
};

/**
 * clears the search results
 */
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

/**
 * sets the selected recipe to highlight in the list
 * @param {number} id recipe id
 */
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(item => {
        item.classList.remove('results__link--active');
    });

    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

/**
 * shortens the recipe title to keep them all close to the same
 * @param {string} title recipe title
 * @param {number} limit string length limit for the title
 */
export const limitRecipeTitle = (title, limit = 15) => {
    //if the title is less then or equal to our limit
    //we dont need to do anything so just leave.
    if(title.length <= limit)
        return title;

    const newTitle = [];

    //use reduce to loop though each element, check the accumulated value
    //and add it to the new title if its less then our limit
    title.split(' ').reduce((acc, cur) => {
        if(acc + cur.length <= limit) {
            newTitle.push(cur);
        }
        return acc + cur.length;
    }, 0); 

    //we need to make sure we have at least on word in the title
    if(newTitle.length === 0)
    {
        newTitle.push(title.split(' ')[0]);
        //console.log(newTitle);
    }

    return `${newTitle.join(' ')} ...`;
};

/**
 * creates and displays the html markup
 * @param {object} recipe recipe to display
 */
const renderRecipe = recipe => {
    const markup = 
    `<li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

/**
 * creates the next and previous buttons
 * @param {number} page the page to list on the button
 * @param {string} type prev or next to change the arrowsw
 */
const createButton = (page, type) => `
    <button class="${elementStrings.buttonClass} results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>    
        <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;

/**
 * renders the page buttons
 * @param {number} page page number
 * @param {number} numResults the number of results returned fromm the search
 * @param {number} resPerPage the total we want to show on each page
 */
const renderPageButtons = (page, numResults, resPerPage) => {
    //round up to whole numbers so you dont have 4.5 pages
    const pages = Math.ceil( numResults / resPerPage);
    let button;
    if(page === 1 && pages > 1) {
        //button just for next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        //button to prev and next
        button = `${createButton(page, 'prev')}
                    ${createButton(page, 'next')}`;

    } else if (page === pages && pages > 1) {
        //button for prev
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

/**
 * calculates what recipes to render
 * @param {list} recipes list of recipes
 * @param {number} page page number
 * @param {number} resPerPage total per page
 */
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;

    recipes.slice(start, end).forEach(renderRecipe);

    renderPageButtons(page, recipes.length, resPerPage);
};
