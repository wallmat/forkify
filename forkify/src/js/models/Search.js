import axios from 'axios';
import { food2ForkKey } from '../config';

export default class Search {
    //constructor just needs the search query
    constructor(query) {
        this.query = query;
    };

    /**
     * sets the results of the search into 'result'
     */
    async getResults() {
        //if needed with CORS
        //const proxy = 'https://crossorigin.me';

        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${food2ForkKey}&q=${this.query}`);
            
            if(res.data.recipes === undefined)
                alert(`response didnt return any valid recipes`);
            
            this.result = res.data.recipes;

        } catch(error) {
            alert(error);
        }
    };
}