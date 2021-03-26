import 'index.scss';
import AccountAddView from 'views/AccountAddView/AccountAddView';
import ExtractFromStorageView from 'views/ExtractFromStorageView/ExtractFromStorageView';
import MainView from 'views/MainView/MainView';
import RegisterPilotView from 'views/RegisterPilotView/RegisterPilotView';
import Router from 'services/Router';
import Routes from 'consts/Routes';

const body = document.body;
const router = new Router(body);

router
    .register(Routes.Main, new MainView())
    .register(Routes.AccountAdd, new AccountAddView())
    .register(Routes.RegisterPilot, new RegisterPilotView())
    .register(Routes.ExtractFromStorage, new ExtractFromStorageView())
    .start();
