import {applyOptionsTo} from "../utils.js";

export function createInput(options) {
    const input = document.createElement('input');
    applyOptionsTo(input, options)

    return input;
}
