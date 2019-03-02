import { elements } from './base';

/**
 * creates the html markup and adds the recipe ingredient to the list
 * @param {object} item ingredient to add to the list
 */
export const renderItem = item => {
    const markup = 
    `<li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" min="0" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>`;

    elements.shopping.insertAdjacentHTML('beforeend', markup);
};

/**
 * removes the selected ingredient from the shopping list
 * @param {number} id ingredient id
 */
export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);

    if(item) item.parentElement.removeChild(item);
};