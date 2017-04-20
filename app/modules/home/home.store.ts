import * as Immutable from "immutable"

export type IHomeState = Immutable.Map<string, any>;

export const homeInitialState = {
    "assigned-to": [],
    "watching": [],
}

export const homeReducer = (state, action) => {
    switch(action.type){
        case 'SET_ASSIGNED_TO':
            return state.set('assigned-to', action.payload);
        case 'SET_WATCHING':
            return state.set('watching', action.payload);
        default:
            return state;
    }
};
