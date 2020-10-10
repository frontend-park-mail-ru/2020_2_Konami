import {applyOptionsTo} from "../utils.js";
import {createInput} from "../Input/Input.js";

export function createRadioBtn(btnId, text, name, value, options, checked = false) {
    const div = document.createElement('div');
    applyOptionsTo(div, options);
    const input = createInput(
        {type:'radio', id: btnId, value: value, name: name, required: 'true'});
    if (checked) {
        input.checked = true;
    }

    div.appendChild(input);
    const lbl = document.createElement('label');
    lbl.htmlFor = btnId;
    lbl.textContent = text;
    div.appendChild(lbl);
    return div;
}
