const socket = io('http://localhost:3000');

require.config({
    paths: { vs: './node_modules/monaco-editor/min/vs' },
});

const requirePaths = ['vs/editor/editor.main'];

require(requirePaths, init);

const sessionStartDateTime = `${new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
})}`;

document.querySelector('#screen-title').textContent = sessionStartDateTime;

document.querySelector('#clipboard-icon').addEventListener('click', () => {
    navigator.clipboard.writeText(
        document.querySelector('#share-session-id').value
    );

    VanillaToasts.create({
        title: 'CodeShare',
        text: 'Copied to clipboard!',
        type: 'success',
        icon: './favicon.ico',
        timeout: 5000,
    });
});

const links = document.querySelectorAll('.link');

for (const link of links) {
    link.addEventListener('click', handleLinkClick);
}

document.querySelector('#editor-area').addEventListener('click', () => {
    document.querySelector('#screen-title').textContent = sessionStartDateTime;

    document.querySelector('#share-screen').style.display = 'none';
    document.querySelector('#settings-screen').style.display = 'none';
    document.querySelector('#editor').style.display = 'block';
});

document.querySelector('#share').addEventListener('click', () => {
    document.querySelector('#screen-title').textContent = 'Share Code';

    document.querySelector('#editor').style.display = 'none';
    document.querySelector('#settings-screen').style.display = 'none';
    document.querySelector('#share-screen').style.display = 'block';
});

document.querySelector('#settings').addEventListener('click', () => {
    document.querySelector('#screen-title').textContent = 'Editor Settings';

    document.querySelector('#editor').style.display = 'none';
    document.querySelector('#share-screen').style.display = 'none';
    document.querySelector('#settings-screen').style.display = 'block';
});

let isChatWindowInitialize = false;
let chatBox = null;
document.querySelector('#chat').addEventListener('click', () => {
    if (!isChatWindowInitialize) {
        chatBox = new WinBox('CodeShare - Chat', {
            root: document.body,
            class: ['no-full'],
            background: '#78909c',
            x: 'center',
            y: 'center',
            width: '70%',
            height: '70%',
            mount: document.querySelector('#chat-screen'),
            onclose: () => (isChatWindowInitialize = false),
        });
    }

    isChatWindowInitialize = true;
});

function handleLinkClick(e) {
    if (e.target.id !== 'chat') {
        removeActiveLinks();
        e.target.classList.add('active');
    }
}

function removeActiveLinks() {
    for (const link of links) {
        link.classList.remove('active');
    }
}

function init() {
    const editorDiv = document.querySelector('#editor');

    const monacoEditor = monaco.editor;
    const monacoLanguages = monaco.languages;

    const editor = monacoEditor.create(editorDiv);

    configureEditorTheme(editor);
    configureEditorLanguage(editor, monacoEditor, monacoLanguages);
    configureCursorStyle(editor);
    configureCursorBlinking(editor);
    configureFontSize(editor);
    configureTabSize(editor);

    onEditorContentChange(editor);
}

function configureEditorTheme(editor) {
    const themeSelect = document.querySelector('#theme-select');
    themeSelect.addEventListener('change', function () {
        editor.updateOptions({
            theme: this.value,
        });
    });
}

function configureEditorLanguage(editor, monacoEditor, monacoLanguages) {
    const languageSelect = document.querySelector('#language-select');

    const languages = monacoLanguages.getLanguages();
    for (const language of languages) {
        const length = languageSelect.options.length;
        languageSelect.options[length] = new Option(language.id, language.id);
    }

    languageSelect.addEventListener('change', function () {
        monacoEditor.setModelLanguage(editor.getModel(), this.value);
    });
}

function configureCursorStyle(editor) {
    const cursorSelect = document.querySelector('#cursorSelect');

    cursorSelect.addEventListener('change', function () {
        editor.updateOptions({
            cursorStyle: this.value,
        });
    });
}

function configureCursorStyle(editor) {
    const cursorStyleSelect = document.querySelector('#cursor-style-select');

    cursorStyleSelect.addEventListener('change', function () {
        editor.updateOptions({
            cursorStyle: this.value,
        });
    });
}

function configureCursorBlinking(editor) {
    const cursorBlinkSelect = document.querySelector('#cursor-blink-select');

    cursorBlinkSelect.addEventListener('change', function () {
        editor.updateOptions({
            cursorBlinking: this.value,
        });
    });
}

function configureFontSize(editor) {
    const fontSize = document.querySelector('#font-size');

    fontSize.addEventListener('change', function () {
        if (!this.value) return;

        editor.updateOptions({
            fontSize: this.value,
        });
    });
}

function configureTabSize(editor) {
    const tabSize = document.querySelector('#tab-size');

    tabSize.addEventListener('change', function () {
        if (!this.value) return;

        editor.updateOptions({
            tabSize: this.value,
        });
    });
}

function onEditorContentChange(editor) {
    editor.onKeyUp(() => {
        const editorContent = editor.getValue();
        socket.emit('editor-content-change', editorContent);
    });

    socket.on('editor-content-change', editorContent =>
        editor.setValue(editorContent)
    );
}

const queryStrings = new URLSearchParams(window.location.search);
const userName = queryStrings.get('userName');
const sessionId = queryStrings.get('sessionId');

document.querySelector('#share-session-id').value = sessionId;

socket.emit('session-join', userName, sessionId);

socket.on('message', (msg, isChat) => {
    let callback = null;
    if (isChat)
        callback = () => {
            if (chatBox) chatBox.maximize();
        };

    VanillaToasts.create({
        title: 'CodeShare',
        text: msg,
        type: 'info',
        icon: './favicon.ico',
        timeout: 5000,
        callback,
    });
});

socket.on('session-users', users => {
    const usersList = document.querySelector('.users-container');
    usersList.innerHTML = '';

    for (const user of users) {
        usersList.innerHTML += `
        <li class="list-group-item">
            <img class="img-circle media-object pull-left"
                style="cursor: pointer;"
                src="https://ui-avatars.com/api/?name=${user.username}&background=random" alt="Avatar"
                width="32"
                height="32"
            />
            <div class="media-body">
                <h4 style="margin-top: 4%; cursor: pointer;" id="user-name" class="grey">${user.username}</h5>
            </div>
        </li>
        `;
    }
});

socket.on('session-users', users => {
    const chatUserList = document.querySelector('#chatUserList');
    let output = '';

    for (const user of users) {
        output += `<li class="clearfix">
      <img src="https://ui-avatars.com/api/?name=${user.username}&background=random" alt="Avatar" />
      <div style="margin-top: 6%;" class="about">
        <div class="name">${user.username}</div>
      </div>
    </li>`;
    }

    chatUserList.innerHTML = output;
});

const chatForm = document.querySelector('#chatForm');

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    let message = e.target.elements.message.value;
    message = message.trim();

    if (!message) return;

    socket.emit('chat-message', message);

    e.target.elements.message.value = '';
    e.target.elements.message.focus();

    document.querySelector('#messageArea').innerHTML += `
    <li class="clearfix">
    <div class="message-data float-right">
        <span style="font-weight: bold">${userName}</span>
        <span class="message-data-time">${formatTime(new Date())}</span>
    </div>
    <div class="message other-message">
        ${message}
    </div>
    </li>`;

    const chatArea = document.querySelector('#chat-area');
    chatArea.scrollTop = chatArea.scrollHeight;
});

socket.on('chat-message', (uName, message) => {
    const messageArea = document.querySelector('#messageArea');
    messageArea.innerHTML += `<li class="clearfix">
    <div class="message-data">
      <span style="font-weight: bold">${uName}</span>
      <span class="message-data-time">${formatTime(new Date())}</span>
      </div>
      <div class="message my-message">${message}</div>
  </li>`;

    const chatArea = document.querySelector('#chat-area');
    chatArea.scrollTop = chatArea.scrollHeight;
});

function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}
