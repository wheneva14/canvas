
import React, { Component } from "react";
import ReactDOM from 'react-dom';
import { Route, Router } from "react-router";
import { HashRouter, browserHistory, BrowserRouter, IndexRoute, Link } from "react-router-dom";

import createBrowserHistory from "history/createBrowserHistory";

// 加入Redux core處理 stores
import { createStore } from 'redux'
import { Provider } from 'react-redux'

// 加入Reducers 處理數據流 
import Reducers from './reducers/index';

//設置store (自來reducers/index.js)
const store = createStore(Reducers)
import './style.scss';

if (window.location.href.indexOf('/zh_cn/') > 0) {
    lang = "zh_cn"
} else if (window.location.href.indexOf('/en/') > 0) {
    lang = "en"
} else {
    lang = "zh_tw"
}


// import registerServiceWorker from 'react-service-worker';

import App1 from './App1';
import AllComponents from 'bib-react-global';

let { Popup, Loader } = AllComponents;

const history = createBrowserHistory();
const Home = () => <h2>Home</h2>;
const Home2 = () => <h2>Home2</h2>;
const AboutUs = () => <h2>aboutUs</h2>;

const Index = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Users = () => <h2>Users</h2>;

global.document = window.document;
global.navigator = window.navigator;

let root = document.getElementById('root')
let aboutUs = document.getElementById('aboutUs')

class Sample extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {   

        this.popup.show({
        title : 'hello',
        content: "test here",
  
        //theme options:dark/light/red/blue/green/yellow
        theme: "dark",
        onCancel: true,
        onComfirm: () => {
          alert("testing");
        },
        onComfirmText: "testing",
        onCancelText: "取消",
        comfirmActive: false,
        crossIcon: true,
        headerIcon: "!"
      });

    }

    render() {
        return (
            <Popup ref={
                ref => { this.popup = ref }
            } />
        )
    }
}

if (root) {
    // history.push("/")
    ReactDOM.render((
        <Provider store={store} >
            <Router history={history}>
                <Route>
                    <BrowserRouter basename={lang} history={browserHistory} forceRefresh={false}>

                        <div>
                            <nav>
                                <Sample />
                                <ul>
                                    <li className="testing">
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li>
                                        <Link to="/about">About</Link>
                                    </li>
                                    <li>
                                        <Link to="/users">Users</Link>
                                    </li>
                                </ul>
                            </nav>

                            <Route path="/" exact component={App1} />
                            <Route path="/about" component={About} />
                            <Route path="/users" component={Users} />
                        </div>
                    </BrowserRouter>
                </Route>
            </Router>

        </Provider>
    ), root);
}



if (aboutUs)
    ReactDOM.render((
        <AboutUs />
    ), aboutUs);


// registerServiceWorker();