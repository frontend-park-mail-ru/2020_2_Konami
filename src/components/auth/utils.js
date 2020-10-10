export function applyOptionsTo(el, options) {
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
