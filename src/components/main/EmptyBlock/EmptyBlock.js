'use strict';

export function createEmptyBlock() {
    const block = document.createElement('div');
    block.classList.add('empty-block');

    return block;
}