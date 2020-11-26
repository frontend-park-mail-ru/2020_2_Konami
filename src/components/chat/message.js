'use strict';

export function createIncomingMsg(text, timestamp, label) {
    const div = document.createElement('div');
    div.classList.add('incoming_msg');
    div.innerHTML = `
        <div class="incoming_msg_img"> 
<!--            <img src="https://ptetutorials.com/images/user-profile.png" class="message_icon" alt="sunil"> -->
            <a style="text-decoration:none" href="/profile?userId=${label.id}">
                <img src="${label.imgSrc}" class="message_icon" alt="sunil"> 
            </a>
        </div>
        <div class="received_msg">
            <div class="received_withd_msg">
                  <p>
                    <a style="text-decoration:none" href="/profile?userId=${label.id}">
                        <span class="author_name"> ${label.name}</span>
                    </a>
                    ${text}
                  </p>
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
    const todayDate = new Date();

    let dateStr;
    if (date.getMonth() === todayDate.getMonth() &&
        (date.getDate() === todayDate.getDate() || date.getDate() === todayDate.getDate() - 1)) {
        dateStr = date.getDate() === todayDate.getDate() ? 'Сегодня' : 'Вчера';
    } else {
        dateStr = months[date.getMonth()] + ' ' + date.getDate();
    }

    let minutes = date.getMinutes();
    minutes = parseInt(minutes, 10) < 10 ? '0' + minutes : minutes;

    const parsedStr = `${date.getHours()}:${minutes}    |    ${dateStr}`
    return parsedStr;
}

const months = {
    0: 'Январь',
    1: 'Февраль',
    2: 'Март',
    3: 'Апрель',
    4: 'Май',
    5: 'Июнь',
    6: 'Июль',
    7: 'Август',
    8: 'Сентябрь',
    9: 'Октябрь',
    10: 'Ноябрь',
    11: 'Декабрь',
}
