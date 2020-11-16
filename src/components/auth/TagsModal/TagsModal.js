'use strict';

import {createDomTag, TAGS} from '@/js/config/tags.js'
import {createBtn} from "@/components/auth/Button/button";
import {createModalDialog} from "@/components/auth/ModalDialog/ModalDialog.js";


export function createTagsModal() {
    const helperText = document.createElement('span');
    helperText.classList.add('helpText');
    helperText.textContent = 'Добавьте интересы в свой профиль, чтобы получать персональные рекомендации';

    // const tabs = createTagFilterTabsWrapper();
    // const tabsContainer = tabs.getElementsByClassName('filters__tabs-wrapper')[0];
    // const keys = Object.keys(TAGS);
    // const domTabs = keys.map((k) => createDomTab(k));
    // domTabs[0].classList.add('filters__tabs_active');
    // tabsContainer.append(...domTabs);
    //
    //
    // const tagsWrapper = document.createElement('div');
    // tagsWrapper.classList.add('recommendationTagsWrapper');
    // Object.keys(TAGS).forEach((key) => {
    //     let div = document.createElement('div');
    //     div.append(...TAGS[key].map((tagName) => createDomTag(tagName)));
    //     div.classList.add('tabTags');
    //     div.style.display = 'none';
    //     tagsWrapper.appendChild(div);
    // })
    //
    // const tabTags = tagsWrapper.getElementsByClassName('tabTags');
    // tabTags[0].style.display = 'flex';
    //
    // const filterTAbs = tabs.getElementsByClassName('filters__tabs');
    // Array.from(filterTAbs).forEach((tab, idx) => {
    //    tab.onclick = () => {
    //        Array.from(tabTags).forEach((tabTag) => {
    //            tabTag.style.display = 'none';
    //        });
    //        document.getElementsByClassName('filters__tabs_active')[0].classList.toggle('filters__tabs_active');
    //        tab.classList.add('filters__tabs_active');
    //
    //        const curTabDiv = tabTags[idx];
    //        curTabDiv.style.display = 'flex';
    //    }
    // });

    const {tabsWrapper, tagsWrapper} = createTabsAndTags();

    const applyTagsBtnWrap = document.createElement('div');
    applyTagsBtnWrap.classList.add('footer__button');
    applyTagsBtnWrap.appendChild(createBtn('Применить',
        {id:'closeTagsModal', type:'button', classList: ['stdBtn', 'secondary', 'activable']}));



    return  createModalDialog({id:'modalTags', classList: ['modal']}, [helperText, tabsWrapper, tagsWrapper, applyTagsBtnWrap]);
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

export function createDomTab(key) {
    const span = document.createElement('span');
    span.classList.add('filters__tabs');
    span.textContent = key;
    return span;
}

export function createTagFilterTabsWrapper() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="filters__tabs-container">
            <div class="filters__tabs-wrapper">
<!--                <span class="filters__tabs filters__tabs_active">Разработка</span>-->
<!--                <span class="filters__tabs">Менеджмент</span>-->
            </div>
    </div>
    `

    return div.firstElementChild;
}


export function createTabsAndTags() {
    const tabsWrapper = createTagFilterTabsWrapper();
    const tabsContainer = tabsWrapper.getElementsByClassName('filters__tabs-wrapper')[0];
    const keys = Object.keys(TAGS);
    const domTabs = keys.map((k) => createDomTab(k));
    domTabs[0].classList.add('filters__tabs_active');
    tabsContainer.append(...domTabs);


    const tagsWrapper = document.createElement('div');
    tagsWrapper.classList.add('recommendationTagsWrapper');
    Object.keys(TAGS).forEach((key) => {
        let div = document.createElement('div');
        div.append(...TAGS[key].map((tagName) => createDomTag(tagName)));
        div.classList.add('tabTags');
        div.style.display = 'none';
        tagsWrapper.appendChild(div);
    })

    const tabTags = tagsWrapper.getElementsByClassName('tabTags');
    tabTags[0].style.display = 'flex';

    const filterTAbs = tabsWrapper.getElementsByClassName('filters__tabs');
    Array.from(filterTAbs).forEach((tab, idx) => {
        tab.onclick = () => {
            Array.from(tabTags).forEach((tabTag) => {
                tabTag.style.display = 'none';
            });
            document.getElementsByClassName('filters__tabs_active')[0].classList.toggle('filters__tabs_active');
            tab.classList.add('filters__tabs_active');

            const curTabDiv = tabTags[idx];
            curTabDiv.style.display = 'flex';
        }
    });

    return {tabsWrapper, tagsWrapper}
}
