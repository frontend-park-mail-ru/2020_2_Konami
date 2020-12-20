'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import { 
    getPeople 
} from "@/js/services/API/api.js";
import PeopleModel from "./PeopleModel.js";
import PeopleView from "./PeopleView.js";

const PEOPLECOUNT = 6;

export default class PeopleController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new PeopleModel();
        this.view = new PeopleView(parent, this.model);
    }

    activate(queryParams) {
        getPeople({limit: PEOPLECOUNT}).then(response => {
            if (response.statusCode === 200) {
                // kaef
            } else {
                // ne kaef
                return;
            }
            this.view.render(response.parsedJson);
        });
    }

    deactivate() {
        this.view.erase();
    }
}