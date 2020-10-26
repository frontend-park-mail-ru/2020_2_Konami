'use strict';

export function createMeetPage(data) {
    const tmp = document.createElement('div');
    tmp.innerHTML = window.MeetPageTemplate(data);

    return tmp.firstElementChild;
}