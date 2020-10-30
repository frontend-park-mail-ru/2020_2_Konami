import EventBus from "../../../js/services/EventBus/EventBus.js";
import {SELECT_TAGS} from "../../../js/services/EventBus/EventTypes.js";

export function createSelectedTag(value) {
    const tag = document.createElement('div');
    tag.classList.add('selectedTag');

    tag.textContent = value;

    const closeBtnWrapper = document.createElement('div');
    closeBtnWrapper.classList.add('closeWrapper');
    let span = document.createElement('span');
    span.classList.add('close');
    span.textContent = '×';  // delete tag btn
    span.onclick = () => {
        const parent = document.getElementsByClassName('selectedTagsWrapper')[0];
        parent.removeChild(tag);
    }

    closeBtnWrapper.appendChild(span);
    tag.appendChild(closeBtnWrapper);

    return tag;
}

export const saveSelectedTags = () => {
    const tags = Array.from(document.getElementsByClassName('btnLike'));
    const selectedRecomendationTags = []
    tags.forEach((tag) => {
        if (tag.checked) {
            selectedRecomendationTags.push(tag.value);
        }
    });

    const selectedTagsBlock = document.getElementsByClassName('selectedTagsWrapper')[0];
    selectedTagsBlock.innerHTML = '';

    const selectedTags =  selectedRecomendationTags.map((tagValue) => createSelectedTag(tagValue));
    selectedTagsBlock.append(...selectedTags);
}


export function addTagsModalDialogEventListener() {
    let btn = document.getElementById("openModalBtn");
    const modal = document.getElementById('modalTags');

    btn.onclick = function() {
        modal.style.display = "block";
    }
}

export function closeTagsModalDialog(evt) {
    const closeBtn = document.getElementsByClassName("close")[0];
    const modal = document.getElementById('modalTags');

    if (evt.target === modal || evt.target === closeBtn) {
        modal.style.display = "none";
        EventBus.dispatchEvent(SELECT_TAGS);
    }
}
