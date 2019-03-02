/**
 * Common location to store strings and global used functions 
 */

export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
    searchResPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shopping: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

export const elementStrings = {
    loader: 'loader',
    buttonClass: 'btn-inline'
};

/**
 * parents and starts a loading wheel animation
 * @param {object} parent html object to parent the loading wheel under
 */
export const renderLoader = parent => {
    const loader = `
    <div class="${elementStrings.loader}">
        <svg>
            <use href="img/icons.svg#icon-cw"></use>
        </svg>
    </div>`;

    parent.insertAdjacentHTML('afterbegin', loader)
};

/**
 * turns off the loading wheel
 */
export const clearLoader = () => {
    //have to get the loader here because it doesnt exist from the start
    const loader = document.querySelector(`.${elementStrings.loader}`);

    if(loader) {
        loader.parentElement.removeChild(loader);
    }
};