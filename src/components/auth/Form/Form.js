'use strict';

export class AuthForm {
    #parent

    #header
    #main
    #footer

    #onSubmit

    constructor(parent, onSubmit = () => {}) {
        this.#parent = parent;
        this.#main = document.createElement('main');
        this.#header = document.createElement('header');
        this.#footer = document.createElement('footer');
        this.#onSubmit = onSubmit;
    }

    get main() {
        return this.#main;
    }
    get header() {
        return this.#header;
    }
    get footer() {
        return this.#footer;
    }

    render() {
        const form = document.createElement('form');
        form.classList.add('vertical-center');

        form.appendChild(this.#header)
        form.appendChild(this.#main);
        form.appendChild(this.#footer);

        const formWrapper = document.createElement('div');
        formWrapper.classList.add('authForm');
        formWrapper.appendChild(form);

        form.addEventListener('submit', this.#onSubmit);

        this.#parent.appendChild(formWrapper);
    }

}
