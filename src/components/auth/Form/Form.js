'use strict';

export class AuthForm {
    constructor(parent) {
        this._parent = parent;
        this._main = document.createElement('main');
        this._header = document.createElement('header');
        this._footer = document.createElement('footer');
        this._form = null;
    }

    get main() {
        return this._main;
    }
    get header() {
        return this._header;
    }
    get footer() {
        return this._footer;
    }

    get form() {
        const form = document.createElement('form');
        form.classList.add('vertical-center');

        form.appendChild(this._header)
        form.appendChild(this._main);
        form.appendChild(this._footer);

        const formWrapper = document.createElement('div');
        formWrapper.classList.add('authForm');
        formWrapper.appendChild(form);

        this._form = form;

        return formWrapper
    }

    getForm() {
        return this._form;
    }

    render() {
        const form = this.form

        this._parent.appendChild(form);
    }

}
