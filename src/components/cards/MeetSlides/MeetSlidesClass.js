'use strict';

const template = require('./MeetSlideTemplate.pug');
const mobileTemplate = require('./MeetSlideMobileTemplate.pug');

export default class MeetSlider {
    constructor(isMobile) {
        this._isMobile = isMobile;
        if (isMobile) {
            this._createMobile();
        } else {
            this._createDesktop();
        }
    }

    render() {
        return this._this;
    }

    appendSlide(data, action, likeAction, goButtonAction) {
        let startDate = new Date(data.card.startDate);
        const options = {weekday: 'long', month: 'long', day: 'numeric' };
        data.dateStr = startDate.toLocaleDateString('ru-RU', options);

        let newSlide = null;
        let likeIcon = null;
        let goButton = null;
        if (this._isMobile) {
            newSlide = this.__createSlideMobile(data);

            likeIcon = newSlide.getElementsByClassName('meet-slide-mobile__like-icon')[0];
        } else {
            newSlide = this.__createSlideDesktop(data);

            likeIcon = newSlide.getElementsByClassName('meet-slide__like-icon-wrapper')[0];
            goButton = newSlide.getElementsByClassName('meet-slide__go-button')[0];
        }

        newSlide.addEventListener('click', action);
        likeIcon.addEventListener('click', likeAction);
        if (goButton !== null) {
            goButton.addEventListener('click', goButtonAction);
        }

        this._slides.appendChild(newSlide);
    }

    appendEmptySlide() {
        const newSlide = document.createElement('div');
        newSlide.classList.add('meet-slide-mobile__empty');

        const title = document.createElement('h1');
        title.classList.add('meet-slide-mobile__empty-title');
        title.innerHTML = 'Мы ничего не нашли все плохо';

        newSlide.appendChild(title);

        this._slides.appendChild(newSlide)
    }

    remove() {
        this._this.remove();
    }

    __createSlideMobile(data) {
        const tmp = document.createElement('div');
        tmp.innerHTML = mobileTemplate(data);

        return tmp.firstElementChild;
    }

    __createSlideDesktop(data) {
        const tmp = document.createElement('div');
        tmp.innerHTML = template(data);

        return tmp.firstElementChild;
    }

    _createMobile() {
        const element = document.createElement('div');
        element.classList.add('slide-container-mobile');

        this._slides = element;
        this._this = element;
    }

    _createDesktop() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="slides-wrapper">
                <div class="slide-container">
                    <div class="slide-container__slides">
                    </div>
                </div>
                <div class="slide-container__prev-button">
                        <img class="slide-container__prev" src="/assets/next.svg">
                    </div>
                    <div class="slide-container__next-button">
                        <img class="slide-container__next" src="/assets/next.svg">   
                </div>
            </div>
        `;

        this._slides = wrapper.getElementsByClassName('slide-container__slides')[0];
        const slides = this._slides.children;

        this._this = wrapper.firstElementChild;
    }

    slide(wrapper, items, prev, next) {
        var posX1 = 0,
            posX2 = 0,
            posInitial,
            posFinal,
            threshold = 100,
            slides = items.getElementsByClassName('meet-slide'),
            slidesLength = slides.length,
            slideSize = items.getElementsByClassName('meet-slide')[0].offsetWidth + 25, // 25 - margin-right
            firstSlide = slides[0],
            lastSlide = slides[slidesLength - 1],
            cloneFirst = firstSlide.cloneNode(true),
            cloneLast = lastSlide.cloneNode(true),
            index = 0,
            allowShift = true;

        const mediaQueryMatcher = (media) => {
            if (media.matches) { // If media query matches
                slideSize = 805;  // HARDCODE - ширина карточки
                items.style.left = index === 0 ? (-slideSize) + "px" : (-slideSize * (index + 1)) + "px";
            } else {
                slideSize = 965; // HARDCODE - ширина карточки
                items.style.left = index === 0 ? (-slideSize) + "px" : (-slideSize * (index + 1)) + "px";
            }
        }
        const media = window.matchMedia("(max-width: 1280px)");
        mediaQueryMatcher(media);
        media.addListener(mediaQueryMatcher);

        // Clone first and last slide
        items.appendChild(cloneFirst);
        items.insertBefore(cloneLast, firstSlide);
        // wrapper.classList.add('loaded');

        // Click events
        prev.addEventListener('click', function () { shiftSlide(-1) });
        next.addEventListener('click', function () { shiftSlide(1) });

        // Transition events
        items.addEventListener('transitionend', checkIndex);

        function shiftSlide(dir, action) {
            items.classList.add('shifting');

            if (allowShift) {
                if (!action) { posInitial = items.offsetLeft; }

                if (dir === 1) {
                    items.style.left = (posInitial - slideSize) + "px";
                    index++;
                } else if (dir === -1) {
                    items.style.left = (posInitial + slideSize) + "px";
                    index--;
                }
            };

            allowShift = false;
        }

        function checkIndex () {
            items.classList.remove('shifting');

            if (index === -1) {
                items.style.left = -(slidesLength * slideSize) + "px";
                index = slidesLength - 1;
            }

            if (index === slidesLength) {
                items.style.left = -(1 * slideSize) + "px";
                index = 0;
            }

            allowShift = true;
        }
    }

}
