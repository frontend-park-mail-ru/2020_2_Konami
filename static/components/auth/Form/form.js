function createAuthForm(mainElements, footerElements) {
    const form = document.createElement('form');
    form.classList.add('vertical-center');

    const main = document.createElement('main');
    const footer = document.createElement('footer');

    main.append(...mainElements);
    footer.append(...footerElements);

    form.appendChild(main);
    form.appendChild(footer);

    return form;
}
