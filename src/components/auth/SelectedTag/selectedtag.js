function createSelectedTag(value) {
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
