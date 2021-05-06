import Events from 'consts/Events';
import Routes from 'consts/Routes';

const menuItems = {
    menuLinks: {
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
            name: 'Extract license from storage',
            url: Routes.ExtractFromStorage,
            event: Events.ChangePath,
        },
        useMap: {
            name: 'Use maps',
            url: Routes.UseMap,
            event: Events.ChangePath,
        },
    },
};

export default menuItems;
