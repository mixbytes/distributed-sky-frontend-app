import Events from 'consts/Events';

const RegisterPilotFormItems = {
    accountAddress: {
        inputID: 'accountAddress',
        inputName: 'Добавить аккаунт',
        inputType: 'text',
        event: Events.InputAddress,
    },
    metadataIPFSHash: {
        inputID: 'metadataIPFSHash',
        inputName: 'Добавить IPFS-хеш аккаунта',
        inputType: 'text',
        event: Events.InputHash,

    },
};

export default RegisterPilotFormItems;
