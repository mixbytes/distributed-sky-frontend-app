import Events from 'consts/Events';
import Routes from 'consts/Routes';

const menuItems = {
    menuLinks: {
        uploadToIPFS: {
            name: 'Upload to IPFS',
            url: Routes.UploadToIPFS,
            event: Events.ChangePath,
        },
        accountAdd: {
            name: 'Add account to registry',
            url: Routes.AccountAdd,
            event: Events.ChangePath,
        },
        registerPilot: {
            name: 'Register pilot',
            url: Routes.RegisterPilot,
            event: Events.ChangePath,
        },
        extractIPFSHash: {
            name: 'Extract IPFS hash from storage',
            url: Routes.ExtractIPFSHash,
            event: Events.ChangePath,
        },
        extractPNGFromIPFS: {
            name: 'Extract PNG from IPFS',
            url: Routes.ExtractPNGFromIPFS,
            event: Events.ChangePath,
        },
    },
};

export default menuItems;
