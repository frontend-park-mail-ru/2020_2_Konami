'use strict';

export function createIncomingMsg(text, timestamp, authorId) {
    const div = document.createElement('div');
    div.classList.add('incoming_msg');
    div.innerHTML = `
        <div class="incoming_msg_img"> 
            <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil"> 
        </div>
        <div class="received_msg">
            <div class="received_withd_msg">
                  <p>${text}</p>
                  <span class="time_date"> ${parseTimestamp(timestamp)}</span>
            </div>
        </div>
    `
    return div;
}

export function createOutgoingMsg(text, timestamp) {
    const div = document.createElement('div');
    div.classList.add('outgoing_msg');
    div.innerHTML = `
        <div class="sent_msg">
                  <p>${text}</p>
                  <span class="time_date"> ${parseTimestamp(timestamp)}</span>
        </div>
    `
    return div;
}

function parseTimestamp(ts) {
    const date = new Date(ts);

    const parsedStr = `${date.getHours()}:${date.getMinutes()}    |    ${date.getMonth()} ${date.getDate()}`
    return parsedStr;
}
