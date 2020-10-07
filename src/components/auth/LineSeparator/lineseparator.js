function createLineSeparator(text, options) {
    const sep = document.createElement('div');
    sep.classList.add('separator');

    if (Object.keys(options).length > 0) {
        applyOptionsTo(sep, options);
    }

    sep.textContent = text;
    return sep;
}
