let body = document.body;

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
let keyboard = create('div', 'keyboard', '');
let wrapper = create('div', 'wrapper', '');

body.append(wrapper);
wrapper.append(header, textArea, keyboard);
header.append(title, description);