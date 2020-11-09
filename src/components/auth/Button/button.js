import {applyOptionsTo} from "../utils.js";

export function createBtn(text, options) {
    const btn = document.createElement('button');
    btn.textContent = text;

    applyOptionsTo(btn, options);

    return btn;
}
