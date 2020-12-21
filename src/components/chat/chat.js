'use strict';

export function createChatPopup(chatTitle, isMobile=false) {

    // const stub = `<div class="profile__meetings ${isMobile ? 'slide' : ''}"><div class="icon-with-text"><img class="icon-with-text__meet-preview-icon" src="uploads/meetingpics/2dabef66-57c9-4226-aebf-0fd7cfb0fc10.png"><a class="icon-with-text__link bold" href="/meeting?meetId=9">Market C++ Party</a></div><div class="icon-with-text"><img class="icon-with-text__meet-preview-icon" src="uploads/meetingpics/04248fde-ba58-443e-9009-3cf7255a99ce.png"><a class="icon-with-text__link bold" href="/meeting?meetId=10">CatBoost</a></div><div class="icon-with-text"><img class="icon-with-text__meet-preview-icon" src="uploads/meetingpics/dcb414c5-41a0-482b-899e-711d3edfb955.png"><a class="icon-with-text__link bold" href="/meeting?meetId=12">С++ meetup Moscow #8 in Mail.ru Group</a></div><div class="icon-with-text"><img class="icon-with-text__meet-preview-icon" src="uploads/meetingpics/323fda3d-1055-41a3-85d4-c10c252386e4.png"><a class="icon-with-text__link bold" href="/meeting?meetId=18">Market C++ Rust</a></div></div>`

    const chatPopupClass = isMobile ? 'chat-popup-mobile' : 'chat-popup';
    const panelHeadClass = isMobile ? 'panel-heading' : 'panel-heading mixin';

    const div = document.createElement('div');
    div.innerHTML = `
        <div class="chat-wrapper ${isMobile ? 'wrapper-mobile' : 'wrapper-desktop'}">
<!--            <button class="open-chat-button" >Chat</button>-->
            
            <div class="${panelHeadClass}" id="accordion">
                <img src="/assets/chat.svg" class="panel-heading__icon mt-5">
                <div class="chat-title">${chatTitle}</div>

                    <div class="pull-right">
                        <button data-parent="#accordion" class="open-chat-button">
                            
                        <img src="/assets/chevron-arrow-down.svg" class="panel-heading__icon open-chat-button"></a>
                    </div>
            </div>
    
            <div class="${chatPopupClass}" id="chatPopup">
              <div class="chat-container ${isMobile ? 'slide' : ''}">
<!--                <h1>Chat</h1>-->
            
                <div class="chat-container__messages"> 
                    <div class="msg_history">
                    </div>
                </div> 
            
                <div class="chat-container__buttons"> 
                    <textarea placeholder="Type message.." name="message" maxlength="500" required></textarea>
                    <button type="button" class="btn send-chat-button">Send</button>
                </div>
            </div>
            
            
            <div class="users-container ${isMobile ? 'slide' : ''}">
            
            </div>
            
        </div>
`
    return div.firstElementChild;
}

/**
 * Native scrollTo with callback
 * @param offset - offset to scroll to
 * @param callback - callback function
 */
export function scrollTo(offset, callback) {
    const fixedOffset = offset.toFixed(),
        onScroll = function () {
            if (window.pageYOffset.toFixed() === fixedOffset) {
                window.removeEventListener('scroll', onScroll)
                callback()
            }
        }

    window.addEventListener('scroll', onScroll)
    onScroll()
    window.scrollTo({
        top: offset,
        behavior: 'smooth'
    })
}
