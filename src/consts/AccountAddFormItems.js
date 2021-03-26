import Events from 'consts/Events';

const AccountAddFormItems = {
    accountAddress: {
        inputID: 'accountAddress',
        inputName: 'Account address',
        inputType: 'text',
        event: Events.InputAddress,
    },
    role: {
        inputID: 'role',
        inputName: 'Account role',
        inputType: 'text',
        event: Events.InputRole,
    },
};

export default AccountAddFormItems;
