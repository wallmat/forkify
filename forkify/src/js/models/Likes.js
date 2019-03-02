import uniqid from 'uniqid';

export default class Likes {
    constructor() {
        this.likes = [];
    };

    /**
     * Adds a recipe to the like data
     * @param {number} id recipe id
     * @param {string} title title of the recipe
     * @param {string} author author of the recipe
     * @param {string} img image path
     */
    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);

        //save data
        this.persistData();

        return like;
    };

    /**
     * removes a recipe from the like list 
     * @param {number} id id of the like recipe to remove
     */
    deleteLike(id) {
        const index = this.likes.findIndex(item => item.id === id);
        if(index === -1) {
            console.log(`Unable to find like ${id} to remove`);
            return;
        }
        
        this.likes.splice(index, 1);

        //save data
        this.persistData();
    };

    /**
     * checks if the recipe is in the like list
     * @param {number} id id of the recipe
     */
    isLiked(id) {
        //if we dont find it, its -1 and returns false else true
        return this.likes.findIndex(item => item.id === id) !== -1;
    };

    /**
     * returns the total number of liked items
     */
    getNumLikes() {
        return this.likes.length;
    };

    /**
     * saves the liked items into local storage
     */
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    };

    /**
     * reads the liked items out of local storage
     */
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        //if we found likes in storage load them in as starting likes
        if(storage) this.likes = storage;
    };
}