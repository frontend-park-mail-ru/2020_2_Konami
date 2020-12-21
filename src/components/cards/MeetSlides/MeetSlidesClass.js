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

        this._slides = wrapper.getElementsByClassName('slide-container__slides')[0];
        const slides = this._slides.children;

        let counter = 0;
        const nextButton = wrapper.getElementsByClassName('slide-container__prev-button')[0];
        nextButton.addEventListener('click', () => {
            counter++;
            if (counter >= slides.length) {
                counter = 0;
            }
            const last = slides[slides.length - 1];
            last.remove();
            this._slides.prepend(last);
        });

        const prevButton = wrapper.getElementsByClassName('slide-container__next-button')[0];
        prevButton.addEventListener('click', () => {
            counter--;
            if (counter < 0) {
                counter = slides.length - 1;
            }

            const first = slides[0];
            first.remove();
            this._slides.appendChild(first);
        });

        this._this = wrapper.firstElementChild;
    }
}
