import MainView from 'views/MainView/MainView';
import Router from 'services/Router';
import Routes from 'consts/Routes';

const body = document.body;
const router = new Router(body);

router
    .register(Routes.Main, new MainView())
    // .register(Routes.UploadToIPFS, new)
    // .register(Routes.AccountAdd, new)
    // .register(Routes.RegisterPilot, new)
    // .register(Routes.ExtractIPFSHash, new)
    // .register(Routes.ExtractPNGFromIPFS, new)
    .start();
