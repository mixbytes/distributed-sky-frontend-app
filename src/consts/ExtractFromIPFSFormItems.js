import Events from 'consts/Events';

const ExtractFromIPFSFormItems = {
    metadataIPFSHash: {
        inputID: 'metadataIPFSHash',
        inputName: 'IPFS hash',
        inputType: 'text',
        event: Events.InputHash,
    },
};

export default ExtractFromIPFSFormItems;
