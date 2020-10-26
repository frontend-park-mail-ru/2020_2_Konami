'use strict';

export function displayNotification(text) {
    const app = document.getElementById('app');
    const toasts = document.createElement('div');
    toasts.classList.add('mtoasts');

    toasts.innerHTML += `<div class="mtoasts__toast">
                            <div class="mtoasts__close">
                            <div class="closeWrapper"><span class="close" id="toastsCloseBtn">×</span></div>
                            </div><p class="mtoasts__text mtoasts__text-short"> ${text}</p>
                        </div>`;

    app.appendChild(toasts);

    const closeBtn = document.getElementById('toastsCloseBtn');
    closeBtn.onclick = () => {
        app.removeChild(toasts);
    }
}
