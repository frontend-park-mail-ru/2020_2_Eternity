export default class BaseController {
    view

    constructor(view) {
        this.view = view;
    }

    on(){
        this.view.render();
    }
    off(){
        this.view.clear();
    }
}