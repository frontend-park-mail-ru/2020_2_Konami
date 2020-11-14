'use strict';

import {createDomTag, TAGS} from '@/js/config/tags.js'
import {createBtn} from "@/components/auth/Button/button";
import {createModalDialog} from "@/components/auth/ModalDialog/ModalDialog.js";


export function createTagsModal() {
    const tags = document.createElement('div');
    tags.classList.add('recommendationTagsWrapper');
    tags.append(...TAGS.map((tagName) => createDomTag(tagName)));

    const helperText = document.createElement('span');
    helperText.classList.add('helpText');
    helperText.textContent = 'Добавьте интересы в свой профиль, чтобы получать персональные рекомендации';

    const applyTagsBtnWrap = document.createElement('div');
    applyTagsBtnWrap.classList.add('footer__button');
    applyTagsBtnWrap.appendChild(createBtn('Применить',
        {id:'closeTagsModal', type:'button', classList: ['stdBtn', 'secondary', 'activable']}));

    return  createModalDialog({id:'modalTags', classList: ['modal']}, [helperText, tags, applyTagsBtnWrap]);
}

export function getSelectedTags() {
    const tags = Array.from(document.getElementsByClassName('btnLike'));
    const selectedRecomendationTags = []
    tags.forEach((tag) => {
        if (tag.checked) {
            selectedRecomendationTags.push(tag.value);
        }
    });

    return selectedRecomendationTags;
}
