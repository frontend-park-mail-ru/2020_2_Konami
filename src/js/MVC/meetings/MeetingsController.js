'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import MeetingsModel from "./MeetingsModel.js";
import { getMeetings } from "@/js/services/API/api.js";
import MeetingsView from "./MeetingsView.js";

export default class MeetingsController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new MeetingsModel();
        this.view = new MeetingsView(parent, this.model);
    }

    activate(queryParams) {
        this._parseQuery(queryParams);

        if (this.model._isQueryEmpty) {
            const recomendation = getMeetings({pageNum: 1});

            const soon = getMeetings({pageNum: 1});

            const mostExpected = getMeetings({pageNum: 1});

            Promise.all([recomendation, soon, mostExpected]).then(values => {
                /*if (recomendation.statusCode === 200) {
                    // kaef
                } else {
                    // ne kaef
                    return;
                }*/
                this.view.render(values[0].parsedJson, values[1].parsedJson, values[2].parsedJson);
            });
        } else {
            getMeetings({pageNum: 1}).then(obj => {
                this.view.renderWithQuery(obj.parsedJson);
            });
        }
    }

    _parseQuery(queryParams) {
        let isEmpty = null;
        for (let key of Object.keys(this.model._queryConfig)) {
            this.model._queryConfig[key] = queryParams.get(key);
            isEmpty = isEmpty || queryParams.get(key);
        }
        if (isEmpty === null) {
            this.model._isQueryEmpty = true;
        } else {
            this.model._isQueryEmpty = false;
        }
    }

    deactivate() {
        this.view.erase();
    }
}
