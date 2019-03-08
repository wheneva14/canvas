export default function(state ={}, action){
	switch (action.type) {
        case 'GET_TEXT':
            return GET_TEXT(state, action);
        default:
			return state;
    }
}


function GET_TEXT(state, {textData}){
    return {...state, ...textData}
}