"use strict";

const gallery = {
    settings: {
        previewSelector: '.previewGallery',
        openedImageWrapperClass: 'maxGalleryWrapper',
        opennedImageClass: 'maxGalleryWrapper__image',
        opennedImageCloseBtnClass: 'maxGalleryWrapper__close',
        opennedImageCloseBtnSrc: 'images/gallery/close.png',
    },

    init(userSettings = {}) {
        Object.assign(this.settings, userSettings);
        
        document
        .querySelector(this.settings.previewSelector)
        .addEventListener('click', event => this.containerClickHandler(event));
    },

    containerClickHandler(event) {
        if (event.target.tagName !== 'IMG') {
            return;
        } 
        
        this.openImage(event.target.dataset.ful_img_src);
    },

    openImage(src) {
        this.getScreenContainer().querySelector(`.${this.settings.opennedImageClass}`).src = src;
       
    },

    getScreenContainer() {
        const galleryWrapperElement = document.querySelector(`.${this.settings.openedImageWrapperClass}`);
        if (galleryWrapperElement) {
            return galleryWrapperElement;
        }
        return this.createScreenContainer();
    },

    createScreenContainer() {
        const galleryWrapperElement = document.createElement('div');
        galleryWrapperElement.classList.add(this.settings.openedImageWrapperClass);
        
        
        const image = document.createElement('img');
        image.classList.add(this.settings.opennedImageClass);
        galleryWrapperElement.appendChild(image);


        const closeImageElement = document.createElement('img');
        closeImageElement.classList.add(this.settings.opennedImageCloseBtnClass);
        closeImageElement.src = this.settings.opennedImageCloseBtnSrc;
        closeImageElement.addEventListener('click', () => this.close());
        galleryWrapperElement.appendChild(closeImageElement);
        
        
        document.body.appendChild(galleryWrapperElement);

        return galleryWrapperElement;
    },

    close() {
        document.querySelector(`.${this.settings.openedImageWrapperClass}`).remove();
    },
}
