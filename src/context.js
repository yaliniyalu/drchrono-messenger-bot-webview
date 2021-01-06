
class Context {
    constructor() {
        this.context = {};
    }

    getUserId() {
        return this.context.psid;
    }

    getToken() {
        return this.context.signed_request;
    }

    setContext(context) {
        this.context = context;
    }

    getContext() {
        return this.context;
    }
}

export default new Context();
