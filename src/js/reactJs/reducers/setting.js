export default function(state ={}, action){
	switch (action.type) {
        case 'INIT_SETTING':
            return INIT_SETTING(state, action);
        default:
			return state;
    }
}


function INIT_SETTING(state, {setting}){
    return {...state, ...setting}
}