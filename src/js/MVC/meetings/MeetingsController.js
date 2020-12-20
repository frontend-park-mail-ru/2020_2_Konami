'use strict';

import Controller from "@/js/basics/Controller/Controller.js";
import MeetingsModel from "./MeetingsModel.js";
import { getMeetings } from "@/js/services/API/api.js";
import {
    MeetingsView, 
    MEETINGSCOUNT,
} from "./MeetingsView.js";

import {TAGS, TAGS_IMGS} from "@/js/config/tags";

const MEETINGSCOUNTWITHOUTQUERY = 3;

export default class MeetingsController extends Controller {

    constructor(parent) {
        super(parent);
        this.model = new MeetingsModel();
        this.view = new MeetingsView(parent, this.model);
    }

    activate(queryParams) {
        this._parseQuery(queryParams);

        /*
         * Тут вообщем если query параметров нет, то рисуем главную страницу
         * ничего кроме двух методов во вью не придумал
         * наверное это костыль жесткий нужно будет это как-нить поправить чтоли 
         * */
    
        if (this.model._isQueryEmpty) {
            this.view._cards = null;
            // тут нужно будет получить рекомендации с ?filter=recomendations&limit=5
            const recomendation = getMeetings({limit: MEETINGSCOUNTWITHOUTQUERY}, 'recommended'); // пока что рекомендации не работают

            // тут нужно будет получить с ?startDate=now&endDate=now+7&limit=3
            let date = new Date();
            date.setDate(date.getDate() + 7);
            const soon = getMeetings({
                limit: MEETINGSCOUNTWITHOUTQUERY,
                startDate: Date.now(),
                endDate: date,
            });

            // тут нужно будет получить рекомендации с /meetings/top?limit=3
            const mostExpected = getMeetings({limit: MEETINGSCOUNTWITHOUTQUERY}, 'top');

            Promise.all([recomendation, soon, mostExpected]).then(values => {
                /* C этим тоже нужно что-то сделать, но пока пусть так будут 
                if (recomendation.statusCode === 200) {
                    // kaef
                } else {
                    // ne kaef
                    return;
                }*/
                this.view.render(values[0].parsedJson, values[1].parsedJson, values[2].parsedJson);
            });
        } else {
            this.view._cards = null;
            let collectionQuery = '';
            if (this.model._queryConfig.collectionId !== '') {
                TAGS[this.model._queryConfig.collectionId].forEach(item => {
                    collectionQuery += `tag=${item}&`;
                });
                console.log(collectionQuery);
            }
            
            getMeetings({
                limit: MEETINGSCOUNT, 
                start: this.model._queryConfig.dateStart,
                end: this.model._queryConfig.dateEnd,
                tagId: this.model._queryConfig.tagId,
                meetId: this.model._queryConfig.meetId,
                meta: collectionQuery,
            }, this.model._queryConfig.filter).then(obj => {
                this.view.renderWithQuery(obj.parsedJson);
            });

        }
    }

    _parseQuery(queryParams) {
        let isEmpty = null;
        for (let key of Object.keys(this.model._queryConfig)) {
            this.model._queryConfig[key] = queryParams.get(key);
            isEmpty = isEmpty || queryParams.get(key);
        }
        if (isEmpty === null) {
            this.model._isQueryEmpty = true;
        } else {
            this.model._isQueryEmpty = false;
        }
    }

    deactivate() {
        this.view.erase();
    }
}
