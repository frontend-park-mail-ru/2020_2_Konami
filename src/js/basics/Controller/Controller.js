'use strict';

export default class Controller {

    constructor(parent) {
        this.parent = parent;
    }

    destructor() {
        this.parent.innerHTML = '';
    }

    activate() {
    }

}
