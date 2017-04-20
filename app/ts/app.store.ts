import * as Immutable from "immutable"
import {homeInitialState, homeReducer} from "../modules/home/home.store"

export type IState = Immutable.Map<string, any>;

const globalInitialState = {
    user: {},
    projects: [],
};

const initialState = Immutable.fromJS({
    global: globalInitialState,
    home: homeInitialState,
})

export const globalReducer = (state, action) => {
    switch(action.type){
        case 'SET_USER':
            return state.set('user', action.payload);
        case 'SET_PROJECTS':
            return state.set('projects', action.payload);
        default:
            return state;
    }
};

export const rootReducer = (state=initialState, action) => {
    return state.set('global', globalReducer(state.get('global'), action))
                .set('home', homeReducer(state.get('home'), action));
};
