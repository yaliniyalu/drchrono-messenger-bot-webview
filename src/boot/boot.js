import Vue from 'vue'

import title from './../mixins/title'
import context from "src/context";
import http from "src/http";

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
export default async (/* { app, router, Vue ... } */) => {
    // something to do
    Vue.mixin(title);

/*    return new Promise((resolve, reject) => {
        // window.extAsyncInit = function() {
        MessengerExtensions.getContext(process.env.VUE_APP_FACEBOOK_APP_ID,
            function success(thread_context){
                context.setContext(thread_context);
                http.defaults.headers.Authorization = context.getToken();
                resolve();
            },
            function error(err){
                reject();
            }
        );
        // };
    })*/
}
