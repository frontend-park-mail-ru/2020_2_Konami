'use strict';

export default class Controller {

    constructor(parent) {
        this.parent = parent;
    }

    deactivate() {
        this.parent.innerHTML = '';
    }

    activate() {
    }

}
