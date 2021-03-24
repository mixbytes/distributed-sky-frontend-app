import Events from 'consts/Events';

const RegisterPilotFormItems = {
    accountAddress: {
        inputID: 'accountAddress',
        inputName: 'Добавить аккаунт',
        inputType: 'text',
        event: Events.InputAddress,
    },
    imageForIPFS: {
        inputID: 'imageForIPFS',
        inputName: 'Image for IPFS',
        event: Events.UploadImage,
    },
};

export default RegisterPilotFormItems;
