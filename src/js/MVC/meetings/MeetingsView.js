'use strict';

import { createMetCard } from "../../../components/cards/MetCard/MetCard.js";
import BaseView from "../../basics/BaseView/BaseView.js";
import EventBus from "../../services/EventBus/EventBus.js";
import { 
    REDIRECT 
} from "../../services/EventBus/EventTypes.js";

export default class MeetingsView extends BaseView {

    constructor(parent, model) {
        super(parent);
        this.parent = parent;
        this.model = model;
        this._this = null;
    }

    render(cards) {
        const main = document.createElement('main');
        main.classList.add('main'); 
        this.parent.appendChild(main);

        this._this = main;

        cards.forEach(item => {
            const metCard = createMetCard(item);
            metCard.addEventListener('click', () => {
                EventBus.dispatchEvent(REDIRECT, {url: `/meet?meetId=${item.id}`});
            });

            main.appendChild(metCard);
        });

    }

    erase() {
        if (this._this !== null) {
            this._this.remove();
        }
    }
}