import BaseComponent from 'components/BaseComponent';
import Events from 'consts/Events';
import ExtractFromIPFSFormItems from 'consts/ExtractFromIPFSFormItems';
import Routes from 'consts/Routes';
import StandardButton from 'components/BaseComponents/StandardButton/StandardButton';
import template from 'components/ExtractFromIPFSForm/ExtractFromIPFSForm.hbs';
import TextInput from 'components/BaseComponents/TextInput/TextInput';

export default class ExtractFromIPFSForm extends BaseComponent {
    constructor(context = {}) {
        super(context);
        this._template = template;
        this._context.input = [];

        for (const i in ExtractFromIPFSFormItems) {
            if (Object.prototype.hasOwnProperty.call(ExtractFromIPFSFormItems, i)) {
                this._context.input.push((new TextInput(ExtractFromIPFSFormItems[i])).render());
            }
        }

        this._context.RegisterPath = Routes.ExtractFromIPFS;
        this._context.RegisterEvent = Events.ChangePath;

        this._context.StandardButton = (new StandardButton({
            buttonName: 'Extract from IPFS',
            event: Events.ExtractFromIPFSSubmit,
        })).render();
    }
}
