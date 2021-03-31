import Events from 'consts/Events';

const RegisterPilotFormItems = {
    accountAddress: {
        inputID: 'accountAddress',
        inputName: 'Account address',
        inputType: 'text',
        event: Events.InputAddress,
    },
    licensePNG: {
        inputID: 'licensePNG',
        inputName: 'License PNG',
        event: Events.UploadImage,
    },
};

export default RegisterPilotFormItems;
