
import { getDateTime } from './common/index';

import  $  from 'jquery';

const {Modernizr} = window;

import "babel-core/register";
import "babel-polyfill";

function init () {
    loadModule();
    // initTest();
    // console.log(process.env.REACT_APP_PROJECT, "HI")
}

function loadModule () {
    
    const $body = $('body');

    initModule({
        module$: import(/* webpackChunkName: "shared-core" */ './shared-core'),
    });
    

    if ($body.hasClass('chunk-index')) {
        initModule({
            module$: import(/* webpackChunkName: "chunk-index" */ './chunk-index'),
            // callback: () => { console.log('chunk-index MODULE LOADED'); },
        });
    }

    // initModule({
    //     module$: import('./googleMap'),
    // });

}

function initModule (payload = {}) {

    const {
        module$,
        callback,
    } = payload;

    module$
        .then((module) => { 
            if (typeof module.default !== 'undefined') {
                module.default();
            }

            if (typeof callback !== 'undefined') {
                callback();
            }
        })
        .catch((err) => {
            console.log('ERR', err);
        });

}

function initTest () {
    console.log('DATETIME', getDateTime());
   

}

((module) => {

    init({module});

})(this);

