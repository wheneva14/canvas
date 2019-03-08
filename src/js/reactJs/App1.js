import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslate, IntlActions } from 'react-redux-multilingual'

// 從Setting取得基本設置
import getSetting from "./setting/";
import { initSetting, getText } from "./action/";
import translations from '../language.json';

// import "./App.css";

// 引入最Core Local的框架
import App1MainPanel from './containers/AppIndex'
import localSetting from './setting/local/index'

let lang = ""

if (window.location.href.indexOf('/zh_cn/') > 0){
    lang = "zh_cn"
} else if (window.location.href.indexOf('/en/') > 0){
    lang = "en"
}else{
    lang = "zh_tw"
}

class App1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }; 

        this.setup();

    }
    
    async setup(){
        let { dispatch } = this.props;
        let setting = await getSetting();
        dispatch(initSetting(setting.basicSetting));
        dispatch(getText(translations[lang]));
    }

    render() {
        
        if(!this.props.setting.APIs) return null;
        return (
            <div>
                {console.log('renderApp1')}        
                {this.props.text.contact_fax_2}
                {/* <Loader ref={ref => (global.loader = ref)} color="#000" size={"15px"}/>
                
                <LoaderExtend ref={ref => (global.loaderExtend = ref)} color="#ccc" size={"15px"}/> */}
                <App1MainPanel />
            </div>
        );
    }
}

// class LoaderExtend extends Loader {
//     constructor(props) {
//         super(props);

//     }

//     //- 取代原來show function
//     show(){
//         console.log(' i am show function')
//     }
// }


export default connect(z => z)(withTranslate(App1));
