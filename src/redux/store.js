import { createStore, applyMiddleware } from 'redux';
import { reducer } from './reducers';

const localStorageMiddleware = ({getState}) => {
    return (next) => (action) => {
        const result = next(action);
        let state = getState();

        if (action.type === 'SET_SUBS') {
            let subs = state.subs;
            localStorage.setItem('subs', JSON.stringify(subs));
        } else if (action.type === 'SET_SAVED') {
            let saved = state.saved;
            localStorage.setItem('saved', JSON.stringify(saved));
        } else if (action.type === 'SET_FLAIRS') {
            let flairs = state.flairs;
            localStorage.setItem('reddit-flairs', JSON.stringify(flairs));
        }

        return result;
    }
};

const getFromLocalStorage = () => {
    let storedSubs = localStorage.getItem('subs');
    if (storedSubs !== undefined) storedSubs = JSON.parse(storedSubs);
    let storedSaves = localStorage.getItem('saved');
    if (storedSaves !== undefined) storedSaves = JSON.parse(storedSaves);
    let storedFlairs = localStorage.getItem('reddit-flairs');
    if (storedFlairs !== undefined) storedFlairs = JSON.parse(storedFlairs);
    let state = reducer();

    if (!storedSubs) storedSubs = [];
    if (!storedSaves) storedSaves = [];
    if (!storedFlairs) storedFlairs = {};

    return {
        ...state,
        subs: storedSubs,
        saved: storedSaves,
        flairs: storedFlairs
    }
}

const store = createStore(reducer, getFromLocalStorage(), applyMiddleware(localStorageMiddleware));

export default store;