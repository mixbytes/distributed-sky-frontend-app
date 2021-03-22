import AccountAddView from 'views/AccountAddView/AccountAddView';
import MainView from 'views/MainView/MainView';
import RegisterPilotView from 'views/RegisterPilotView/RegisterPilotView';
import Router from 'services/Router';
import Routes from 'consts/Routes';
import UploadToIPFSView from 'views/UploadToIPFSView/UploadToIPFSView';

const body = document.body;
const router = new Router(body);

router
    .register(Routes.Main, new MainView())
    // .register(Routes.UploadToIPFS, new UploadToIPFSView())
    .register(Routes.AccountAdd, new AccountAddView())
    .register(Routes.RegisterPilot, new RegisterPilotView())
    // .register(Routes.ExtractIPFSHash, new)
    // .register(Routes.ExtractPNGFromIPFS, new)
    .start();
