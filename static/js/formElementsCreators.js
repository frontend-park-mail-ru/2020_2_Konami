function createInput(options) {
    const input = document.createElement('input');
    applyOptionsTo(input, options)

    return input;
}

function createLabeledElements(labelName, ...elements) {
    const label = document.createElement('label');
    label.textContent = labelName;

    const innerDiv = document.createElement('div');
    elements.forEach((el) => {
        innerDiv.appendChild(el);
    });

    label.appendChild(innerDiv);

    return label;
}

function applyOptionsTo(el, options) {
    Object.keys(options).forEach((opt) => {
        switch (opt) {
            case 'classList':
                el.classList.add(...options[opt]);
                break;
            case 'required':
                if (options[opt] === 'true') {
                    el.required = true;
                } else if (options[opt] === 'false') {
                    el.required = false;
                }
                break;
            default :
                el[opt] = options[opt];
        }
    });
}

function createRadioBtn(btnId, text, name, value, options, checked = false) {
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
