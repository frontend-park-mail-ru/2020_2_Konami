'use strict';

export function createChatPopup() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="chat-wrapper">
<!--            <button class="open-chat-button" >Chat</button>-->
            
            <div class="panel-heading" id="accordion">
    
                <img src="/assets/black-chat.svg" class="panel-heading__icon mt-5">
                    Chat
                    <div class="pull-right">
                        <button data-parent="#accordion" class="open-chat-button">
                            
                        <img src="/assets/chevron-arrow-down.svg" class="panel-heading__icon open-chat-button"></a>
                    </div>
            </div>
    
            <div class="chat-popup" id="chatPopup">
              <div class="chat-container">
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
        </div>
`
    return div.firstElementChild;
}
