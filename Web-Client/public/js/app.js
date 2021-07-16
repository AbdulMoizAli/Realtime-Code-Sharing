const socket = io('http://localhost:3000');

document.addEventListener('DOMContentLoaded', () => {
    const modals = document.querySelectorAll('.modal');
    const selects = document.querySelectorAll('select');
    const toolTips = document.querySelectorAll('.tooltipped');
    const sidenav = document.querySelector('.sidenav');

    const elem = M.Sidenav.init(sidenav, { edge: 'right' });
    document
        .querySelector('#userChat')
        .addEventListener('click', () => elem.open());

    M.Tooltip.init(toolTips);
    M.Modal.init(modals);
    M.FormSelect.init(selects);
});

document.querySelector('#copy-session-id').addEventListener('click', () => {
    navigator.clipboard.writeText(
        document.querySelector('#sessionIdCopy').textContent
    );

    M.toast({ html: 'Copied to clipboard!', classes: 'rounded' });
});

require.config({
    paths: { vs: '../packages/node_modules/monaco-editor/min/vs' },
});

const requirePaths = ['vs/editor/editor.main'];

require(requirePaths, init);

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
    const themeSelect = document.querySelector('#themeSelect');
    const body = document.querySelector('body');

    themeSelect.addEventListener('change', function () {
        if (this.value === 'vs') body.style.backgroundColor = '#fafafa';
        else if (this.value === 'vs-dark')
            body.style.backgroundColor = '#424242';
        else if (this.value === 'hc-black')
            body.style.backgroundColor = '#212121';

        editor.updateOptions({
            theme: this.value,
        });
    });
}

function configureEditorLanguage(editor, monacoEditor, monacoLanguages) {
    const languageSelect = document.querySelector('#languageSelect');
    const languages = monacoLanguages.getLanguages();

    for (const language of languages) {
        const length = languageSelect.options.length;
        languageSelect.options[length] = new Option(language.id, language.id);
    }

    languageSelect.addEventListener('change', function () {
        monacoEditor.setModelLanguage(editor.getModel(), this.value);
    });

    const select = document.querySelector('#languageSelect');
    M.FormSelect.init(select);
}

function configureCursorStyle(editor) {
    const cursorSelect = document.querySelector('#cursorSelect');

    cursorSelect.addEventListener('change', function () {
        editor.updateOptions({
            cursorStyle: this.value,
        });
    });
}

function configureCursorBlinking(editor) {
    const blinkingSelect = document.querySelector('#blinkingSelect');

    blinkingSelect.addEventListener('change', function () {
        console.log(this.value);
        editor.updateOptions({
            cursorBlinking: this.value,
        });
    });
}

function configureFontSize(editor) {
    const fontSizeInput = document.querySelector('#fontSizeInput');

    fontSizeInput.addEventListener('change', function () {
        if (!this.value) return;

        editor.updateOptions({
            fontSize: this.value,
        });
    });
}

function configureTabSize(editor) {
    const tabSizeInput = document.querySelector('#tabSizeInput');

    tabSizeInput.addEventListener('change', function () {
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

document.addEventListener('DOMContentLoaded', () => {
    const queryStrings = new URLSearchParams(window.location.search);
    const username = queryStrings.get('username');
    const sessionId = queryStrings.get('sessionId');

    document.querySelector('#sessionIdCopy').textContent = sessionId;

    socket.emit('session-join', username, sessionId);

    socket.on('message', msg => {
        M.toast({ html: msg, classes: 'rounded' });
    });

    socket.on('session-users', users => {
        const element1 = document.querySelector('#sessionUsers');
        const element2 = document.querySelector('#userCount');
        let output = '';

        for (const user of users) {
            output += `${user.username} <br />`;
        }

        element1.setAttribute('data-tooltip', output);
        element2.textContent = users.length;
    });
});
