import keys from './keys.js';

const { body } = document;

let isCapsLock = false;
let isShift = false;
let currentProperty = null;

function create(tag, style, inner) {
  const elem = document.createElement(tag);
  elem.classList = style;
  elem.innerHTML = inner;
  return elem;
}

const header = create('div', 'header', '');
const title = create('div', 'title', 'Virtual Keyboard');
const description = create('div', 'description', 'For Window OS; left Alt+Shift for change lang.');
const textArea = create('textarea', 'textarea', '');
const keyboardWrap = create('div', 'keyboard', '');
const wrapper = create('div', 'wrapper', '');

body.append(wrapper);
wrapper.append(header, textArea, keyboardWrap);
header.append(title, description);

// lang

const lang = {
  isEng: true,
};

// check

function setCurrent() {
  if (lang.isEng && ((!isShift && !isCapsLock) || (isShift && isCapsLock))) {
    currentProperty = 'en';
  } else if (!lang.isEng && ((!isShift && !isCapsLock) || (isShift && isCapsLock))) {
    currentProperty = 'ru';
  } else if (lang.isEng && isShift) {
    currentProperty = 'shiftEn';
  } else if (!lang.isEng && isShift) {
    currentProperty = 'shiftRu';
  } else if ((lang.isEng && isCapsLock)) {
    currentProperty = 'capsLockEn';
  } else {
    currentProperty = 'capsLockRu';
  }
}

function showCurrent() {
  setCurrent();
  const values = document.querySelectorAll('.keyboardKey div');
  const currentValue = document.querySelectorAll(`.keyboardKey-${currentProperty}`);
  values.forEach((key) => key.classList.add('hidden'));
  currentValue.forEach((keyValue) => keyValue.classList.remove('hidden'));
}

// change lang

lang.isEng = localStorage.getItem('isEng');

const checkChangeLang = (pressedKeys) => {
  if (pressedKeys.has('ShiftLeft') && pressedKeys.has('AltLeft')) {
    lang.isEng = !lang.isEng;
    localStorage.setItem('isEng', lang.isEng);
    showCurrent();
  }
};

// keys created

function createInnerKey(key, classK) {
  const keyboardKey = document.createElement('div');
  keyboardKey.classList = `keyboardKey-${classK}`;
  keyboardKey.innerHTML = key;
  return keyboardKey;
}

function createKey(key, values) {
  const someKey = document.createElement('div');
  someKey.classList = `keyboardKey keyboardKey-${key}`;
  someKey.append(createInnerKey(values.en, 'en'));
  someKey.append(createInnerKey(values.ru, 'ru'));
  someKey.append(createInnerKey(values.shiftEn, 'shiftEn'));
  someKey.append(createInnerKey(values.shiftRu, 'shiftRu'));
  someKey.append(createInnerKey(values.capsLockEn, 'capsLockEn'));
  someKey.append(createInnerKey(values.capsLockRu, 'capsLockRu'));
  return someKey;
}

Object.keys(keys).forEach((key) => {
  const kbKey = createKey(key, keys[key]);
  keyboardWrap.append(kbKey);
});

showCurrent();

// printing into textarea

function setValue(value) {
  const textarea = document.querySelector('.textarea');
  const indexOfCursor = textarea.selectionStart;
  textarea.value = textarea.value.slice(0, indexOfCursor) + value
    + textarea.value.slice(indexOfCursor);
  textarea.selectionStart = indexOfCursor + 1;
  textarea.selectionEnd = indexOfCursor + 1;
}

function deleteValue(key) {
  const textarea = document.querySelector('.textarea');
  const indexOfCursor = textarea.selectionStart;
  const indexOfValue = key === 'Delete' ? indexOfCursor : indexOfCursor - 1;
  textarea.value = textarea.value.slice(0, indexOfValue) + textarea.value.slice(indexOfValue + 1);
  textarea.selectionStart = indexOfValue;
  textarea.selectionEnd = indexOfValue;
}

function checkKey(key) {
  const keySet = document.querySelector(`.keyboardKey-${key}`);
  if (key === 'ShiftLeft' || key === 'ShiftRight') {
    isShift = true;
    showCurrent();
  } else if (key === 'CapsLock') {
    isCapsLock = !isCapsLock;
    if (isCapsLock) {
      keySet.classList.add('active');
    } else {
      keySet.classList.remove('active');
    }
    showCurrent();
  } else if (key === 'Tab') {
    setValue('\t');
  } else if (key === 'Enter') {
    setValue('\n');
  } else if (key === 'ControlLeft' || key === 'ControlRight' || key === 'AltLeft' || key === 'AltRight' || key === 'MetaLeft') {
    throw new Error('This is not an error, just my experiment');
  } else if (key === 'Delete' || key === 'Backspace') {
    deleteValue(key);
  } else {
    const keyValue = keys[key][currentProperty];
    setValue(keyValue);
  }
}

// events

const keyboard = document.querySelector('.keyboard');
const pressedKeys = new Set();

function keydownH(el) {
  const keyCode = el.code;
  const key = document.querySelector(`.keyboardKey-${keyCode}`);
  key.classList.add('active');
  pressedKeys.add(keyCode);
  checkChangeLang(pressedKeys);
  el.preventDefault();
  checkKey(keyCode);
  showCurrent();
}

function keyupH(el) {
  const key = document.querySelector(`.keyboardKey-${el.code}`);
  if (el.code !== 'CapsLock') {
    key.classList.remove('active');
  }
  if (el.code === 'ShiftLeft' || el.code === 'ShiftRight') {
    isShift = false;
    showCurrent();
  }
  pressedKeys.delete(el.code);
}

function keyboardH(el) {
  const eventTarget = el.target;
  const key = eventTarget.closest('.keyboardKey');
  if (!key) {
    return;
  }
  const keyCode = key.classList[1].split('-')[1];
  checkKey(keyCode);
}

document.addEventListener('keydown', keydownH);
document.addEventListener('keyup', keyupH);
keyboard.addEventListener('click', keyboardH);
