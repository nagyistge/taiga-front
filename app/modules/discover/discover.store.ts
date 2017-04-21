import * as Immutable from "immutable"

export type IHomeState = Immutable.Map<string, any>;

export const discoverInitialState = {
    "most-active": [],
    "most-liked": [],
    "featured": [],
    "projects-count": 0,
}

export const discoverReducer = (state, action) => {
    switch(action.type){
        case 'SET_MOST_LIKED':
            return state.set('most-liked', action.payload);
        case 'SET_MOST_ACTIVE':
            return state.set('most-active', action.payload);
        case 'SET_FEATURED_PROJECTS':
            return state.set('featured', action.payload);
        case 'SET_PROJECTS_STATS':
            return state.set('projects-count', action.payload);
        default:
            return state;
    }
};
