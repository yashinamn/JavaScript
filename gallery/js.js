"use strict";

const gallery = {
    settings: {//настройки
        previewSelector: '.previewGallery',//селектор класс первичной галереи с мини фотками
        openedImageWrapperClass: 'maxGalleryWrapper', //класс создаваемого по клику дива, оболочки для полноформатной фотки
        opennedImageClass: 'maxGalleryWrapper__image', //класс создаваемой по клику картинки,  полноформатной фотки
        opennedImageCloseBtnClass: 'maxGalleryWrapper__close', //класс картинки, кнопки закрытия
        opennedImageCloseBtnSrc: 'images/gallery/close.png', //путь до картинки, кнопки закрытия
        opennedImageLeftButtonClass: 'maxGalleryWrapper__left', //класс картинки, кнопки влево
        opennedImageRightButtonClass: 'maxGalleryWrapper__right', //класс картинки, кнопки вправо
        opennedImageNextButtonSrc: 'images/gallery/next.png', //путь до картинки, кнопки "предыдущее/следующее фото"
        dummyImageSrc: 'img/duck.jpg',
        openedImageEl: null,
        allImages: [],
        miniImageSelector: '.miniPhoto',
    },
/**инициализация */
    init(userSettings = {}) {
        Object.assign(this.settings, userSettings); //добавляем в настройки свои уникальные классы и пути до картинок-кнопок
        this.settings.allImages = document.querySelectorAll(this.settings.miniImageSelector);
        console.log(this.settings.allImages);
        
        document
        .querySelector(this.settings.previewSelector)//находим тег див в котором лежат миниатюры
        .addEventListener('click', event => this.containerClickHandler(event)); //добавляем этому диву слушателя события и передаем функция метода хэндлер
    },
/**проверяет куда был клик: если по картинке, то вызывает метод открывания картинки */
    containerClickHandler(event) {
        if (event.target.tagName !== 'IMG') {//если клик был не по картинке, то выходим
            return;
        }  
        
        this.settings.openedImageEl = event.target;
        console.log(this.settings.openedImageEl);
        
        this.openImage(event.target.dataset.ful_img_src);         
    },
/**открывает картинку */
    openImage(src) {
        const image = this.getScreenContainer().querySelector(`.${this.settings.opennedImageClass}`);
        image.src = src;
        
    },
/**открывает следующее фото 
* Возвращает следующий элемент (картинку) от открытой или первую картинку в контейнере,
* если текущая открытая картинка последняя.
* @returns {Element} Следующую картинку от текущей открытой.
*/
    getNextImage() {
        const firstImageSrc = this.settings.allImages[0].dataset.ful_img_src;
        if (this.settings.openedImageEl.nextElementSibling) {
            const nextImageSrc = this.settings.openedImageEl.nextElementSibling.dataset.ful_img_src;
            this.openImage(nextImageSrc);
            this.settings.openedImageEl = this.settings.openedImageEl.nextElementSibling;
        } else {
            this.openImage(firstImageSrc);
            this.settings.openedImageEl = this.settings.allImages[0];
        }
    },
/**открывает предыдущее фото 
* Возвращает предыдущий элемент (картинку) от открытой или последнюю картинку в контейнере,
* если текущая открытая картинка первая.
* @returns {Element} Предыдущую картинку от текущей открытой.
*/
    getPrevImage() {
        const lastImageSrc = this.settings.allImages[this.settings.allImages.length - 1].dataset.ful_img_src;
        if (this.settings.openedImageEl.previousElementSibling) {
            const previousImageSrc = this.settings.openedImageEl.previousElementSibling.dataset.ful_img_src;
            this.openImage(previousImageSrc);
            this.settings.openedImageEl = this.settings.openedImageEl.previousElementSibling;
        } else {
            this.openImage(lastImageSrc);
            this.settings.openedImageEl = this.settings.allImages[this.settings.allImages.length - 1];
        }

    },
/**находит и отдает новый контейнер, к котором будет открываться полная картинка */
    getScreenContainer() {
        const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);//ищем контенер через селектор из настроек
        if (galleryWrapperElement) {//если находим
            return galleryWrapperElement;//то тут же его возвращаем
        }
        return this.createScreenContainer();//иначе вызываем метод создания его
    },
/**создает новый контейнер */
    createScreenContainer() {
        const galleryWrapperElement = document.createElement('div');//создаем новый див
        galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);//присваиваем ему класс из настроек
        
        const image = document.createElement('img'); //создаем новую оболочку картинки
        image.classList.add(this.settings.opennedImageClass); //добавляем ей класс
        galleryWrapperElement.appendChild(image); //добавляем оболочку без пути в див
        image.onerror = () => image.src = this.settings.dummyImageSrc;//вешаем на картинку обработчик события в случае не загрузки

        const closeImageElement = document.createElement('img');//создаем оболочку для картинки-кнопки закрытия
        closeImageElement.classList.add(this.settings.opennedImageCloseBtnClass);//добавляем ей класс из настроек
        closeImageElement.src = this.settings.opennedImageCloseBtnSrc;//присваиваем ей путь из настроек
        closeImageElement.addEventListener('click', () => this.close());//добавляем слушателя событий
        galleryWrapperElement.appendChild(closeImageElement);//добавляем картинку-кнопку в див
        
        const leftImageElement = document.createElement('img');//создаем оболочку для картинки-кнопки-влево 
        leftImageElement.classList.add(this.settings.opennedImageLeftButtonClass);//добавляем ей класс из настроек
        leftImageElement.src = this.settings.opennedImageNextButtonSrc;//присваиваем ей путь из настроек
        leftImageElement.addEventListener('click', () => this.getPrevImage());//добавляем слушателя событий
        galleryWrapperElement.appendChild(leftImageElement);//добавляем картинку-кнопку в див

        const rightImageElement = document.createElement('img');//создаем оболочку для картинки-кнопки-влево 
        rightImageElement.classList.add(this.settings.opennedImageRightButtonClass);//добавляем ей класс из настроек
        rightImageElement.src = this.settings.opennedImageNextButtonSrc;//присваиваем ей путь из настроек
        rightImageElement.addEventListener('click', () => this.getNextImage());//добавляем слушателя событий
        galleryWrapperElement.appendChild(rightImageElement);//добавляем картинку-кнопку в див
        
        document.body.appendChild(galleryWrapperElement);//добавляем див в тело документа в конец

        return galleryWrapperElement;//возвращаем весь наполненный контейнер(скелет)
    },

    close() {
        document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();//удаляем весь блок
    },


    
}
