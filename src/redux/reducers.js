const initialState = {
    currentSub: '',
    currentSort: 'hot',
    currentPostId: '',

    postDetails: {},
    posts: [],
    noPosts: false,
    noMorePosts: false,
    latestPost: '',

    comments: [],
    noComments: false,
    commentSort: 'new',

    subs: [],

    sortMenuOpen: false,
    searchMenuOpen: false,
    subMenuOpen: false,

    currentSearch: '',
    currentSearchSort: 'relevance',
    currentSearchSub: true,
    searchForSubs: false,
};

export const reducer = (state = initialState, action={}) => {
    const data = action.payload;    
    switch(action.type){
        case 'SET_SUB': return {...state, currentSub: data};
        case 'SET_SORT': return {...state, currentSort: data};
        case 'SET_POSTID': return {...state, currentPostId: data};
        case 'SET_POSTS': return {...state, posts: data};
        case 'SET_POST_DETAILS': return {...state, postDetails: data};

        case 'CLEAR_SEARCH': return {...state, currentSearch: '', currentSearchSort: 'relevance', currentSearchSub: true, searchMenuOpen: false};
        case 'OPEN_SEARCH': return {...state, searchMenuOpen: true, sortMenuOpen: false, subMenuOpen: false};
        case 'CLOSE_SEARCH': return {...state, searchMenuOpen: false};

        case 'OPEN_SUBS': return {...state, subMenuOpen: true, sortMenuOpen: false, searchMenuOpen: false};
        case 'CLOSE_SUBS': return {...state, subMenuOpen: false};

        case 'OPEN_SORT': return {...state, sortMenuOpen: true, subMenuOpen: false, searchMenuOpen: false};
        case 'CLOSE_SORT': return {...state, sortMenuOpen: false};

        case 'CLOSE_MENUS': return {...state, sortMenuOpen: false, searchMenuOpen: false, subMenuOpen: false};

        case 'SET_SUBS': return {...state, subs: data};

        case 'SET_CURRENT_SEARCH': return {...state, currentSearch: data};
        case 'SET_CURRENT_SEARCH_SORT': return {...state, currentSearchSort: data};
        case 'SET_CURRENT_SEARCH_SUB': return {...state, currentSearchSub: data};
        case 'SET_SEARCH_FOR_SUBS': return {...state, searchForSubs: data};

        case 'SET_NO_POSTS': return {...state, noPosts: data};
        case 'SET_LATEST_POST': return {...state, latestPost: data};
        case 'SET_NO_MORE_POSTS': return {...state, noMorePosts: data};

        case 'SET_COMMENTS': return {...state, comments: data};
        case 'SET_NO_COMMENTS': return {...state, noComments: data};
        case 'SET_COMMENT_SORT': return {...state, commentSort: data};
        default: return state;
    }
};