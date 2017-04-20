import * as Immutable from "immutable"

export type IHomeState = Immutable.Map<string, any>;

export const discoverInitialState = {
    "most-active": [],
    "most-liked": [],
}

export const discoverReducer = (state, action) => {
    switch(action.type){
        case 'SET_MOST_LIKED':
            return state.set('most-liked', action.payload);
        case 'SET_MOST_ACTIVE':
            return state.set('most-active', action.payload);
        default:
            return state;
    }
};
