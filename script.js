const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};


function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

function validateModal(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
    const regex = new RegExp(expression);

    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields.');
        return false;
    }
    if(!urlValue.match(regex)) {
        alert('No valid URL');
        return false;
    }
    return true;
}

function buildBookmarks() {
    bookmarksContainer.textContent = '';
    Object.keys(bookmarks).forEach((id) => {
        const { name, url } = bookmarks[id];
        const item = document.createElement('div');
        const closeIcon = document.createElement('i');
        const linkInfo = document.createElement('div');
        const favicon = document.createElement('img');
        const link = document.createElement('a');

        item.classList.add('item');
        closeIcon.classList.add('fas', 'fa-times');
        linkInfo.classList.add('name');

        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${id}')`)
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'favicon');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');

        link.textContent = name;

        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

function fetchBookmarks() {
    const localBookmarks = localStorage.getItem('bookmarks');
    if(localBookmarks) {
        bookmarks = JSON.parse(localBookmarks);
    } else {
        const id = 'https://google.de'
        bookmarks[id] = {
                    name: 'Google',
                    url: 'https://google.de',
            };
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

function deleteBookmark(id) {
    if(bookmarks[id]) {
        delete bookmarks[id];
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

function storeBookmark(event) {
    event.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://') && !urlValue.includes('https://')) {
        urlValue = `https://${urlValue}`;
    }

    if(!validateModal(nameValue, urlValue)) {
        return false;
    }

    const bookmark = {
        name: nameValue,
        url: urlValue,
    };

    bookmarks[urlValue] = bookmark;
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}


modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (event) => (event.target === modal ? modal.classList.remove('show-modal') : false));

bookmarkForm.addEventListener('submit', storeBookmark);


fetchBookmarks();