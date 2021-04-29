import EventBus from 'services/EventBus';
import Events from 'consts/Events';

class Router {
    /**
     * Create one instance of handler
     * @constructor
     * @param {HTMLElement} application
     */
    constructor(application) {
        this._application = application;
        this._routes = [];

        EventBus.on(Events.ChangePath, this.onChangePath.bind(this));
    }

    /**
     * Register route path
     * @param {string} path
     * @param {Object} view - view that handles path
     * @return {Object}
     */
    register(path, view) {
        this._routes.push({
            regPath: new RegExp(`^${path.replace(/(:\w+)/, '(\\d+)')}/?$`),
            view: view,
        });

        return this;
    }

    start() {
        this._application.addEventListener('click', (e) => {
            let clickTarget = e.target;

            if (clickTarget.matches('a') ||
                clickTarget.matches('button') ||
                clickTarget.parentNode.matches('button') ||
                clickTarget.parentNode.matches('a') ||
                clickTarget.matches('div')) {
                if (clickTarget.parentNode.matches('button') || clickTarget.parentNode.matches('a')) {
                    clickTarget = clickTarget.parentNode;
                }

                const data = {...clickTarget.dataset};
                if (!Object.prototype.hasOwnProperty.call(data, 'event')) {
                    return;
                }
                e.preventDefault();

                if (Object.prototype.hasOwnProperty.call(clickTarget, 'id')) {
                    data.id = clickTarget.id;
                }
                data.target = clickTarget;

                EventBus.emit(data.event, data);
            }
        });
        this._application.addEventListener('change', (evt) => {
            const changeTarget = evt.target;

            if (changeTarget.matches('textarea') || changeTarget.matches('input') && changeTarget.type !== 'date') {
                evt.preventDefault();

                const data = {...changeTarget.dataset};
                data.id = changeTarget.id;
                data.value = changeTarget.value;
                data.target = changeTarget;

                EventBus.emit(data.event, data);
            }
        });

        window.addEventListener('popstate', () => {
            this.go(window.location.pathname, window.history.state);
        });

        this.go(window.location.pathname);
    }

    /**
     * Go to route path
     * @param {string} path
     * @param {Object} data - data for the route path
     */
    go(path, data = {}) {
        const routeData = {...this.getDataFromPath(path), ...data};
        if (this.currentView === routeData.view) {
            this.currentView.off();
            this.currentView.show(routeData);
            return;
        }
        if (this.currentView) {
            this.currentView.hide();
        }
        this.currentView = routeData.view;
        if (window.location.pathname !== path) {
            window.history.pushState(null, null, path);
        }
        this.currentView.show(routeData);

        console.log("now new event runs");
        EventBus.emit(Events.FormRendered);
    }

    /**
     * Get data from route path
     * @param {string} path
     *
     * @return {Object}
     */
    getDataFromPath(path) {
        const result = {};

        this._routes.forEach(({regPath, view}) => {
            const match = path.match(regPath);

            if (match) {
                const id = match[match.length - 1];

                result.id = id ? +id : null;
                result.view = view;
            }
        });

        return result;
    }

    /**
     * Event handler on changing path
     * @param {Object} data
     */
    onChangePath(data) {
        this.go(data.path, data);
    }
}

export default Router;
