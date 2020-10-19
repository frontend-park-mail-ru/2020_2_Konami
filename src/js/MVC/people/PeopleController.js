'use strict';

import Controller from "../../basics/Controller/Controller.js";
import { 
    getPeople 
} from "../../services/API/api.js";
import PeopleModel from "./PeopleModel.js";
import PeopleView from "./PeopleView.js";

export default class PeopleController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new PeopleModel();
        this.view = new PeopleView(parent, this.model);
    }

    activate() {
        const urlParams = new URLSearchParams(window.location.search);
        let pageNum = urlParams.get('pageNum');
        if (pageNum === null) {
            pageNum = 1;
        }
        getPeople(pageNum).then(response => {
            if (response.statusCode === 200) {
                // kaef
            } else {
                // ne kaef
                return;
            }
            this.view.registerEvents();
            this.view.render(response.parsedJson);
        });
    }

    deactivate() {
        this.view.erase();
    }
}