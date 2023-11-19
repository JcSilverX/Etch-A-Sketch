import {
    elementFromHtml
} from '../common.js';

const Default = {
    rows: 16,
    cols: 16
};

export default class EtchASketch {
    constructor(element) {
        this._element = element;
        this._config = this.Default;
        
        this._gridSize = this._findOne('.grid-size', this._element);
        this._gcontainer = this._findOne('.g-container', this._element);

        this._penColour = this._findOne('#pen-colour', this._element);
        this._bgColour = this._findOne('#bg-colour', this._element);

        this._addEventListeners();
    };

    // getters/setters
    get Default() {
        return Default;
    }

    // public methods
    makeGrid(rows = this._config.rows, cols = this._config.cols) {
        this._gcontainer.style.setProperty('--jsx-grid-rows', rows);
        this._gcontainer.style.setProperty('--jsx-grid-cols', cols);

        for (let index = 0; index < (rows * cols); index++) {
            const cell = elementFromHtml(`<div class="g-container__item border"></div>`);
            this._appendToDom(this._gcontainer, cell);
        }

        this._pen();
    }

    clear() {
        this._find('.g-container__item', this._gcontainer)
            .forEach((cells) => {
                cells.classList.remove('hover');
            });
    }

    // private methods
    _findOne(selector, element) {
        return element.querySelector(selector);
    }

    _find(selector, element) {
        return element.querySelectorAll(selector);
    }

    _appendToDom(html, element, position = 'beforeend') {
        html.insertAdjacentElement(position, element);
    }

    _addEventListeners() {
        this._find('option', this._gridSize)
            .forEach((option) => {
                option.addEventListener('click', (event) => {
                    const THIS = event.target;

                    this._config.rows = parseInt(THIS.value);
                    this._config.cols = this._config.rows;

                    if (typeof this._config.rows !== 'number') return;

                    this._findOne('option[selected]', this._gridSize).removeAttribute('selected');
                    this._find('.g-container__item', this._gcontainer).forEach((item) => this._gcontainer.removeChild(item));


                    THIS.setAttribute('selected', true);

                    if (!THIS.hasAttribute('selected')) return;

                    this.makeGrid();
                });
            });
        
        this._findOne('.btn--clear', this._element).addEventListener('click', () => this.clear(), this._pen());
    }


    _pen() {
        this._find('.g-container__item', this._gcontainer)
            .forEach((item) => {
                item.addEventListener('mousemove', (event) => event.target.classList.add('hover') );
                item.addEventListener('touchmove', (event) => event.target.classList.add('hover') );
                item.addEventListener('pointermove', (event) => event.target.classList.add('hover') );
            });
    }

    // static methods 

};


window.addEventListener('load', () => {
    const THIS = document.querySelector('.etch-a-sketch');

    const instance = new EtchASketch(THIS);

    instance.makeGrid();
});
