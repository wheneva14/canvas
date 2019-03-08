import  $  from 'jquery';
import Promise from 'promise-polyfill';
import { indexInit } from './chunk-index';

const loadModule = ()=>{
    const $body = $('body');
	
    initModule({
        module$: new Promise((resolve, reject)=>{
            resolve(indexInit)
        }),
    });



}

const callModule = (module)=>{ 
    return new Promise((resolve, reject)=>{
        resolve(module);
    })
}


const initModule = (payload = {})=>{
    
    const {
        module$,
        callback,
    } = payload;

    console.log(module$);
    
    module$
        .then(module=>{
            module();
        })
        .catch(err=>{
            console.log("ERR", err)
        });


}

const initJs = ()=>{
    loadModule();
}


((module) => {
    initJs({module});
})(this);

