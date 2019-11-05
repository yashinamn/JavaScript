"use strict";

/**
* @property {object} settings Настройки корзины товаров.
* @property {{price: number, name: string}[]} goods Список товаров что купил пользователь.
* @property {HTMLElement} basketCountEl Место для показа количества товаров.
* @property {HTMLElement} basketPriceEl Место для показа цены всех товаров.
*/
const basket = {
    settings: {
        countSelector: '#basket-count',
        priceSelector: '#basket-price',
        catalogSelector: '.catalog'
    },

    goods: [],
    countEl: null,
    priceEl: null,
    /** Инициализирует переменные для корзины и показывает эти значения.
    */
    init(userSettings = {}) {
        Object.assign(this.settings, userSettings); //добавляем в настройки свои уникальные классы и пути до картинок-кнопок
        this.countEl = document.querySelector(this.settings.countSelector);//обозначили спан счетчик количества
        this.priceEl = document.querySelector(this.settings.priceSelector);//обозначили счетчик суммы
        
        document.querySelector(this.settings.catalogSelector)//находим тег див в котором лежат товары
        .addEventListener('click', event => this.containerClickHandler(event)); //добавляем этому диву слушателя события и передаем функция метода хэндлер
    },

    /**проверяет куда был клик: если по кнопке "купить", то вызывает метод добавления товара в корзину */
    containerClickHandler(event) {
        if (event.target.tagName !== 'BUTTON') {//если клик был не по КНОПКЕ КУПИТЬ, то выходим
            return;
        } 
        this.render();  //рендерим корзину   
    },

    /** Отображает количество всех товаров и их цену.
    */
    render() {
        this.add(event.target.dataset.name, event.target.dataset.price); //добавь цену и названия товара в массив товаров, которыe отправляем в корзину
        this.priceEl.textContent = `${this.getGoodsPrice()} руб`;//заполняем строку суммы
        this.countEl.textContent = this.goods.length;//заполняем строку количества
    },

    /** Считает и возвращает цену всех купленных товаров из массива this.goods.
    * @returns {number} Цену всех купленных товаров.
    */
    getGoodsPrice() {
        return this.goods.reduce((sum, val) => sum + val.price, 0);
    },

    /**Добавляет купленный товар в массив купленных товаров и отображает количество и цену всех
    товаров.
    * @param goodName Название товара.
    * @param goodPrice Цена товара.
    */
    add(goodName, goodPrice) {
        this.goods.push({price: +goodPrice, name: goodName});
    },
};

