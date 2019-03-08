import basic from './basic';
import apiSetting from './apiSetting';

let combineSetting = { ...basic, ...apiSetting}


export default async () => {
    return {
        basicSetting: combineSetting,
    }
}