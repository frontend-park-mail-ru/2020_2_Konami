'use strict';

import {
    createSignupFormLayout
} from "../components/auth/Form/FormLayout.js";

import {createModalDialog, placeAuthModal} from "../components/auth/ModalDialog/ModalDialog.js";

function loginModal(application) {
    let modal = document.getElementById("authModal");
    const closeBtn = document.getElementsByClassName("close")[0];

    modal.style.display = "block";

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
}

function signUpModal(application) {
    const header = document.getElementsByClassName('header')[0];
    let modal = document.getElementById("authModal");
    header.removeChild(modal);

    const signupForm = createSignupFormLayout(application);

    modal = createModalDialog({id:'authModal', classList: ['modal']}, [signupForm.form]);
    header.appendChild(modal);

    modal.style.display = "block";
    const span = document.getElementsByClassName('close')[0];

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            placeAuthModal();
        }
    }
}

export {
    loginModal,
    signUpModal,
}
