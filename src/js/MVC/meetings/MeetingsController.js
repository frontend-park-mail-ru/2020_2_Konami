'use strict';

import Controller from "../../basics/Controller/Controller.js";

export default class MeetingsController extends Controller {

    constructor(parent) {
        super(parent);
    }

    destructor() {

    }

    activate() {
        const span = document.createElement('span');
        span.textContent = 'MEETINGS';
        this.parent.appendChild(span);
    }
}
