'use strict';

export function createHeaderLinksPopup() {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div class="popup-links__container" id="popupLinksContainer">
            
        <div class="popup-links__container__main">
            <div class="popup-links__container__main__row" id="profileLink">
                <div class="popup-links__container__main__row__wrapper-icon">
                    <div class="popup-links__container__main__row__wrapper-icon__icon">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDljMi42NjcgMCA0LTMuMDEzIDQtNS4xNDNTMTAuMjEgMCA4IDAgNCAxLjcyNyA0IDMuODU3IDUuMzMzIDkgOCA5em0tNi44NDUgNC45OGEuNDc3LjQ3NyAwIDAgMC0uMDI1LjA0M2wtLjI3NS40OEExIDEgMCAwIDAgMS43MjMgMTZoMTIuNTU0YTEgMSAwIDAgMCAuODY4LTEuNDk2bC0uMjc1LS40OGExLjQ2MiAxLjQ2MiAwIDAgMC0uMDI1LS4wNDRDMTQuNjU2IDEzLjY3MiAxMi4zMTIgMTAgOCAxMGMtNC4zMTIgMC02LjY1NiAzLjY3Mi02Ljg0NSAzLjk4eiIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==">
                    </div>
                </div>
                <div>
                    Профиль
                </div>
            </div>
            
            <div class="popup-links__container__main__row" id="locationLink">
                <div class="popup-links__container__main__row__wrapper-icon">
                    <div class="popup-links__container__main__row__wrapper-icon__icon">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03LjU5IDE3LjgyQzkuMjc3IDE2LjM2NyAxNCAxMS44NjUgMTQgN0E3IDcgMCAxIDAgMCA3YzAgNC44NjUgNC43MjMgOS4zNjcgNi40MSAxMC44MmEuODk1Ljg5NSAwIDAgMCAxLjE4IDB6TTcgOWEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDR6IiBmaWxsPSIjMDAwIi8+PC9zdmc+">
                    </div>
                </div>
                <div>
                    Москва
                </div>
            </div>
            
            <div class="popup-links__container__main__row" id="editprofileLink">
                <div class="popup-links__container__main__row__wrapper-icon">
                    <div class="popup-links__container__main__row__wrapper-icon__icon">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02LjkwNS4zNzlBLjUuNSAwIDAgMSA3LjM5IDBoMS4yMmEuNS41IDAgMCAxIC40ODUuMzc5bC40NTYgMS44MjNhNS45NjQgNS45NjQgMCAwIDEgMS40NTIuNjAybDEuNjEyLS45NjdhLjUuNSAwIDAgMSAuNjEuMDc1bC44NjMuODYyYS41LjUgMCAwIDEgLjA3NS42MTFsLS45NjcgMS42MTJjLjI2LjQ1LjQ2NS45MzguNjAyIDEuNDUybDEuODIzLjQ1NkEuNS41IDAgMCAxIDE2IDcuMzl2MS4yMmEuNS41IDAgMCAxLS4zNzkuNDg1bC0xLjgyMy40NTZhNS45NjEgNS45NjEgMCAwIDEtLjYwMiAxLjQ1MmwuOTY3IDEuNjEyYS41LjUgMCAwIDEtLjA3NS42MWwtLjg2Mi44NjNhLjUuNSAwIDAgMS0uNjExLjA3NWwtMS42MTItLjk2N2MtLjQ1LjI2LS45MzguNDY1LTEuNDUyLjYwMmwtLjQ1NiAxLjgyM0EuNS41IDAgMCAxIDguNjEgMTZINy4zOWEuNS41IDAgMCAxLS40ODUtLjM3OWwtLjQ1Ni0xLjgyM2E1Ljk2NSA1Ljk2NSAwIDAgMS0xLjQ1Mi0uNjAybC0xLjYxMi45NjdhLjUuNSAwIDAgMS0uNjEtLjA3NWwtLjg2My0uODYyYS41LjUgMCAwIDEtLjA3NS0uNjExbC45NjctMS42MTJhNS45NjUgNS45NjUgMCAwIDEtLjYwMi0xLjQ1MkwuMzggOS4wOTVBLjUuNSAwIDAgMSAwIDguNjFWNy4zOWEuNS41IDAgMCAxIC4zNzktLjQ4NWwxLjgyMy0uNDU2YTUuOTY0IDUuOTY0IDAgMCAxIC42MDItMS40NTJsLS45NjctMS42MTJhLjUuNSAwIDAgMSAuMDc1LS42MWwuODYyLS44NjNhLjUuNSAwIDAgMSAuNjExLS4wNzVsMS42MTIuOTY3Yy40NS0uMjYuOTM4LS40NjQgMS40NTItLjYwMkw2LjkwNS4zOHpNOCAxMGEyIDIgMCAxIDAgMC00IDIgMiAwIDAgMCAwIDR6IiBmaWxsPSIjMDAwIi8+PC9zdmc+">
                    </div>
                </div>
                <div>
                    Редактировать профиль
                </div>
            </div>
            
            <div class="popup-links__container__main__row" id="signoutLink">
                <div class="popup-links__container__main__row__wrapper-icon">
                    <div class="popup-links__container__main__row__wrapper-icon__icon">
                        <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik04IDFhMSAxIDAgMCAxIDEtMWg4YTEgMSAwIDAgMSAxIDF2MTJhMSAxIDAgMCAxLTEgMUg5YTEgMSAwIDAgMS0xLTFWOGg0YTEgMSAwIDEgMCAwLTJIOFYxek01IDZoM3YySDV2MS45NmEuNS41IDAgMCAxLS44MTIuMzlMMCA3bDQuMTg4LTMuMzVBLjUuNSAwIDAgMSA1IDQuMDRWNnoiIGZpbGw9IiMwMDAiLz48L3N2Zz4=">
                    </div>
                </div>
                <div>
                    Выйти
                </div>
            </div>
        
        </div>
            
            
        
        <div class="popup-links__container__bottom">
        <div class="popup-links__container__bottom__new-meet" id="newMeetLink">
            <div>
                <div>
                    <img src="assets/add-meet.svg" id="newMeet" class="header-mobile__new-meet-btn" style="display: block;">
                </div>
            </div>
            <div>
                <span>Добавить мероприятие</span>
            </div>
            </div>
            </div>
        
        </div>
    `;

    return popup.firstElementChild
}
