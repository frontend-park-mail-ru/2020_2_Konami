'use strict';

import Controller from "../../basics/Controller/Controller.js";
import HeaderView from "./headerView.js";
import HeaderModel from "./headerModel.js";

export default class HeaderController extends Controller {

    constructor(parent) {
        super(parent);
        this.view = new HeaderView(parent, new HeaderModel());
    }

    activate() {
        this.view.render();
    }

    deactivate() {
    }

}
