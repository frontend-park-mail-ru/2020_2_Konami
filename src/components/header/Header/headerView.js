'use strict';

import BaseView from "../../../js/basics/BaseView/BaseView.js";

export default class HeaderView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;

    }

    // TODO(template)
    render() {
        const headerWrapper = document.createElement('div');
        headerWrapper.innerHTML = `
        <header class="header">
            <img src="assets/google.png" class="logo">
            <input type="search" placeholder="Люди, мероприятия" class="searchinput">
            <img src="assets/pericon.svg" class="icon">
        </header>
        `;

        const icon = headerWrapper.getElementsByClassName('icon')[0];
        icon.dataset.section = 'profile';

        this.parent.appendChild(headerWrapper.firstElementChild);
    }

}
