'use strict';

export function displayNotification(text) {
    const app = document.getElementById('app');
    const toasts = document.createElement('div');
    toasts.classList.add('mtoasts');

    const uid = Math.random();

    toasts.innerHTML += `<div class="mtoasts__toast">
                            <div class="mtoasts__close__wrapper">
                            <div class="closeWrapper"><span class="close" id="toastsCloseBtn${uid}">×</span></div>
                            </div><p class="mtoasts__text mtoasts__text-short"> ${text}</p>
                        </div>`;

    app.appendChild(toasts);

    const closeBtn = document.getElementById(`toastsCloseBtn${uid}`);
    closeBtn.onclick = () => {
        app.removeChild(toasts);
    }

    setTimeout(() => {
        if (app.contains(toasts)) {
            app.removeChild(toasts);
        }
    }, 4000);
}
