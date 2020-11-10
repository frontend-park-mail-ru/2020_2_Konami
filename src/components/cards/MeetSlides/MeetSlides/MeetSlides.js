'use strict';

export function createSlides() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <div class="slide-container">
            <div class="slide-container__slides">
            </div>
            <div class="slide-container__prev-button">
                <img class="slide-container__prev" src="/assets/next.svg">
            </div>
            <div class="slide-container__next-button">
                <img class="slide-container__next" src="/assets/next.svg">   
            </div>
        </div>
    `;

    const sliders = wrapper.getElementsByClassName('slide-container__slides')[0];
    const slides = sliders.children;

    let counter = 0;
    let currentNode = slides[0];

    const func = () => {
        const first = slides[0];
        const last = slides[slides.length - 1];

        first.remove();
        last.remove();
    
        sliders.append(first);
        sliders.prepend(last);
    
        currentNode = slides[counter];
    }

    const nextButton = wrapper.getElementsByClassName('slide-container__prev-button')[0];
    nextButton.addEventListener('click', evt => {
        counter++;
        if (counter >= slides.length) {
            counter = 0;
        }
        func();
        // currentNode.classList.add('already-visible');
    });

    const prevButton = wrapper.getElementsByClassName('slide-container__next-button')[0];
    prevButton.addEventListener('click', evt => {
        counter--;
        if (counter < 0) {
            counter = slides.length - 1;
        }
        func();
    });

    return wrapper.firstElementChild;
}