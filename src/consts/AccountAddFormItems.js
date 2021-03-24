import Events from 'consts/Events';

const AccountAddFormItems = {
    accountAddress: {
        inputID: 'accountAddress',
        inputName: 'Добавить аккаунт',
        inputType: 'text',
        event: Events.InputAddress,
    },
    role: {
        inputID: 'role',
        inputName: 'Добавить роль',
        inputType: 'text',
        event: Events.InputRole,
    },
};

export default AccountAddFormItems;
