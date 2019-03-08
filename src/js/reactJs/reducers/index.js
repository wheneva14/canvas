import { combineReducers } from 'redux';
import { IntlReducer as Intl } from 'react-redux-multilingual';


// let translationsData = JSON.stringify(translations["zh_cn"])
// console.log
// import  local  from './local'
import setting  from './setting';
import text from './text';

const App = combineReducers({
    // local,
    Intl,
    text,
    setting
})


export default App