import EventBus from "../../../js/services/EventBus/EventBus.js";
import {
    CLOSE_TAGS_MODAL,
    APPLY_TAGS_MODAL
} from "../../../js/services/EventBus/EventTypes.js";

export function createSelectedTag(tagBtnLikeInput) {
    const tag = document.createElement('div');
    tag.classList.add('selectedTag');

    tag.textContent = tagBtnLikeInput.tagName === 'INPUT' ? tagBtnLikeInput.value : tagBtnLikeInput;

    const closeBtnWrapper = document.createElement('div');
    closeBtnWrapper.classList.add('closeWrapper');
    let span = document.createElement('span');
    span.classList.add('close');
    span.textContent = '×';  // delete tag btn
    span.onclick = () => {
        // const tagLbl = tagBtnLikeInput.parentElement;
        // tagLbl.removeChild(tagBtnLikeInput);
        if (tagBtnLikeInput.checked) {
            tagBtnLikeInput.click();
        }

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
            selectedRecomendationTags.push(tag);
        }
    });

    const selectedTagsBlock = document.getElementsByClassName('selectedTagsWrapper')[0];
    selectedTagsBlock.innerHTML = '';

    const selectedTags =  selectedRecomendationTags.map((tagBtnLikeInput) => createSelectedTag(tagBtnLikeInput));
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
    const allCloseBtns = document.getElementsByClassName("modal__close");

    const closeBtn1 = allCloseBtns[allCloseBtns.length - 1];
    const closeBtn2 = document.getElementById("closeTagsModal");
    const modal = document.getElementById('modalTags');

    if (evt.target === modal || evt.target === closeBtn1) {
        modal.style.display = "none";
        EventBus.dispatchEvent(CLOSE_TAGS_MODAL);
    } else if (evt.target === closeBtn2) {
        modal.style.display = "none";
        EventBus.dispatchEvent(APPLY_TAGS_MODAL);
    }
}
