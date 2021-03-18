import Events from 'consts/Events';

const AccountAddFormItems = {
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
    role: {
        inputID: 'role',
        inputName: 'Добавить роль',
        inputType: 'text',
        event: Events.InputRole,
    },
};

export default AccountAddFormItems;
