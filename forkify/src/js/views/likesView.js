import { elements } from './base';
import { limitRecipeTitle } from './searchView';

/**
 * toggles the heart icon on the recipe
 * @param {bool} isLiked 
 */
export const toggleLikeBtn = isLiked => {
    //icons.svg#icon-heart-outlined
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

/**
 * toggles the likes heart based on if the user has liked any recipes
 * @param {number} numLikes number of likes
 */
export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

/**
 * creates and inserts the html markup for the like in the likes list
 * @param {object} like the liked recipe
 */
export const renderLike = like => {
    const markup = 
    `<li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="${like.img}" alt="${limitRecipeTitle(like.title)}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>`;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

/**
 * removes the like from the html
 * @param {number} id liked recipe id
 */
export const deleteLike = id => {
    const item = document.querySelector(`.likes__link[href="#${id}"]`).parentElement;

    if(item) {
        item.parentElement.removeChild(item);
    }
};