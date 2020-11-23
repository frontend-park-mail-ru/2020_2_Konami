'use strict';

export function createChatPopup() {
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="chat-wrapper">
            <button class="open-chat-button" >Chat</button>
    
            <div class="chat-popup" id="chatPopup">
              <div class="chat-container">
                <h1>Chat</h1>
            
                <div class="chat-container__messages"> 
                    <div class="msg_history">
                    </div>
                </div> 

<!--                <label for="msg"><b>Message</b></label>-->
                <textarea placeholder="Type message.." name="message" maxlength="500" required></textarea>
            
                <div class="chat-container__buttons"> 
   
                    <button type="button" class="btn send-chat-button">Send</button>
                    <button type="button" class="btn close-chat-button">Close</button>    
    
                </div>
              </form>
            </div>
        </div>
`
    return div.firstElementChild;
}
