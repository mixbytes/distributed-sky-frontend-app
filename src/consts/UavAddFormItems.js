import Events from 'consts/Events';

const UavAddFormItems = {
    accountAddress: {
        inputID: 'accountAddress',
        inputName: 'UAV serial number',
        inputType: 'text',
        event: Events.InputSerial,
    },
};

export default UavAddFormItems;
