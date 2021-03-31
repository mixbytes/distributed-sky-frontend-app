import BaseComponent from 'components/BaseComponent';
import EventBus from 'services/EventBus';
import Events from 'consts/Events';
import ImageForIPFS from 'components/ImageForIPFS/ImageForIPFS';
import template from 'components/BaseComponents/ImageInput/ImageInput.hbs';

export default class ImageInput extends BaseComponent {
    /**
     * Create an image input
     * @constructor
     * @param {Object} context
     * */
    constructor(context = {}) {
        super(context);
        this._template = template;

        this._handleFileSelectHandler = this._handleFileSelect.bind(this);

        if (!this._isRendered) {
            EventBus.on(Events.UploadImage, this._handleFileSelectHandler);
            this._isRendered = true;
        }

        this._context.Avatar = (new ImageForIPFS({pathToAvatar: this._context.pathToAvatar})).render();
    }

    _handleFileSelect(data) {
        const file = data.target.files[0];

        if (!file.type.match('image.*')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (() => {
            return function(file) {};
        })(file);

        reader.readAsDataURL(file);
    }
}
