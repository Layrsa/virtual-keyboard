import keys from './keys.js';

let body = document.body;

let isEng = true;
let isShift = true;
let currentProperty = null;

function create(tag, style, inner) {
    let elem = document.createElement(tag);
    elem.classList = style;
    elem.innerHTML = inner;
    return elem;
}

let header = create('div', 'header', '');
let title = create('div', 'title', 'Virtual Keyboard')
let description = create('div', 'description', 'Window OC')
let textArea = create('div', 'text-area', '');
let keyboardWrap = create('div', 'keyboard', '');
let wrapper = create('div', 'wrapper', '');

body.append(wrapper);
wrapper.append(header, textArea, keyboardWrap);
header.append(title, description);

//keys created

function createKey (key, values) {
    const someKey = document.createElement('div');
    someKey.classList = `keyboardKey keyboardKey-${key}`;
    someKey.append(createInnerKey(values.en, 'en'));
    someKey.append(createInnerKey(values.ru, 'ru'));
    someKey.append(createInnerKey(values.shiftEn, 'shiftEn'));
    someKey.append(createInnerKey(values.shiftRu, 'shiftRu'));
    someKey.append(createInnerKey(values.capsEn, 'capsLockEn'));
    someKey.append(createInnerKey(values.capsRu, 'capsLockRu'));
    return someKey;
};

function createInnerKey(key, classK) {
    const keyboardKey = document.createElement('div');
    keyboardKey.classList = `keyboardKey-${classK}`;
    keyboardKey.innerHTML = key;
    return keyboardKey;
};

Object.keys(keys).forEach((key) => {
    const kbKey = createKey(key, keys[key]);
    keyboardWrap.append(kbKey);
});

showCurrent();

//events

const keyboard = document.querySelector('.keyboard');
const pressedKeys = new Set();

function keydownH(el) {
    const keyCode = el.code;
    const key = document.querySelector(`.keyboardKey-${keyCode}`);
    key.classList.add('active');
    pressedKeys.add(keyCode);
    showCurrent();
    console.log(keyCode);
    el.preventDefault();
};

function keyupH(el) {
    const key = document.querySelector(`.keyboardKey-${el.code}`);
    key.classList.remove('active');
    pressedKeys.delete(el.code);
};

function keyboardH(el) {
    const eventTarget = el.target;
    const key = eventTarget.closest('.keyboardKey');
    if (!key) return;
    const keyCode = key.classList[1].split('-')[1];
    console.log(keyCode);
};

document.addEventListener('keydown', keydownH);
document.addEventListener('keyup', keyupH);
keyboard.addEventListener('click', keyboardH);

//check

function showCurrent() {
    setCurrent();
    const values = document.querySelectorAll('.keyboardKey div');
    const currentValue = document.querySelectorAll(`.keyboardKey-${currentProperty}`);
    values.forEach((key) => key.classList.add('hidden'));
    currentValue.forEach((keyValue) => keyValue.classList.remove('hidden'));
};

function setCurrent() {
    if (isEng) {
      currentProperty = 'en';
    } else if (!lang.isEng) {
      currentProperty = 'ru';
    } else if (isEng && isShift) {
      currentProperty = 'shiftEn';
    } else if (!isEng && isShift) {
      currentProperty = 'shiftRu';
    }
};