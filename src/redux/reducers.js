const initialState = {
    currentSub: '',
    currentSort: 'hot',
    currentPostId: '',
    currentUserSort: 'overview',
    currentUser: '',

    postDetails: {},
    posts: [],
    noPosts: false,
    noMorePosts: false,
    latestPost: '',

    comments: [],
    extraComments: [],
    noComments: false,
    commentSort: 'new',

    subs: [],
    saved: [],
    blockedUsers: [],
    flairs: {},

    sortMenuOpen: false,
    searchMenuOpen: false,
    subMenuOpen: false,
    saveMenuOpen: false,
    settingsMenuOpen: false,
    filterMenuOpen: false,

    currentSearch: '',
    currentSearchSort: 'relevance',
    currentSearchSub: true,
    searchForSubs: false,

    previousUrl: '',
    permalinkUrl: '',
    showContext: false,
};

export const reducer = (state = initialState, action={}) => {
    const data = action.payload;    
    switch(action.type){
        case 'SET_SUB': return {...state, currentSub: data};
        case 'SET_SORT': return {...state, currentSort: data};
        case 'SET_POSTID': return {...state, currentPostId: data};
        case 'SET_USER_SORT': return {...state, currentUserSort: data};
        case 'SET_USER': return {...state, currentUser: data};

        case 'SET_POSTS': return {...state, posts: data};
        case 'SET_POST_DETAILS': return {...state, postDetails: data, extraComments: []};

        case 'CLEAR_SEARCH': return {...state, currentSearch: '', currentSearchSort: 'relevance', currentSearchSub: true, searchMenuOpen: false};
        case 'OPEN_SEARCH': return {...state, searchMenuOpen: true, settingsMenuOpen: false, sortMenuOpen: false, subMenuOpen: false, saveMenuOpen: false, filterMenuOpen: false};
        case 'CLOSE_SEARCH': return {...state, searchMenuOpen: false};

        case 'OPEN_SUBS': return {...state, subMenuOpen: true, settingsMenuOpen: false, sortMenuOpen: false, searchMenuOpen: false, saveMenuOpen: false, filterMenuOpen: false};
        case 'CLOSE_SUBS': return {...state, subMenuOpen: false};

        case 'OPEN_SORT': return {...state, sortMenuOpen: true, settingsMenuOpen: false, subMenuOpen: false, searchMenuOpen: false, saveMenuOpen: false, filterMenuOpen: false};
        case 'CLOSE_SORT': return {...state, sortMenuOpen: false};

        case 'OPEN_SAVED': return {...state, saveMenuOpen: true, settingsMenuOpen: false, sortMenuOpen: false, subMenuOpen: false, searchMenuOpen: false, filterMenuOpen: false};
        case 'CLOSE_SAVED': return {...state, saveMenuOpen: false};

        case 'OPEN_SETTINGS': return {...state, settingsMenuOpen: true, saveMenuOpen: false, sortMenuOpen: false, subMenuOpen: false, searchMenuOpen: false, filterMenuOpen: false};
        case 'CLOSE_SETTINGS': return {...state, settingsMenuOpen: false};

        case 'OPEN_FILTER': return {...state, filterMenuOpen: true, settingsMenuOpen: false, saveMenuOpen: false, sortMenuOpen: false, subMenuOpen: false, searchMenuOpen: false};
        case 'CLOSE_FILTER': return {...state, filterMenuOpen: false};

        case 'CLOSE_MENUS': return {...state, settingsMenuOpen: false, sortMenuOpen: false, searchMenuOpen: false, subMenuOpen: false, saveMenuOpen: false, filterMenuOpen: false};

        case 'SET_SUBS': return {...state, subs: data};
        case 'SET_SAVED': return {...state, saved: data};
        case 'SET_BLOCKED_USERS': return {...state, blockedUsers: data};
        case 'SET_FLAIRS': return {...state, flairs: data};

        case 'SET_CURRENT_SEARCH': return {...state, currentSearch: data};
        case 'SET_CURRENT_SEARCH_SORT': return {...state, currentSearchSort: data};
        case 'SET_CURRENT_SEARCH_SUB': return {...state, currentSearchSub: data};
        case 'SET_SEARCH_FOR_SUBS': return {...state, searchForSubs: data};

        case 'SET_NO_POSTS': return {...state, noPosts: data};
        case 'SET_LATEST_POST': return {...state, latestPost: data};
        case 'SET_NO_MORE_POSTS': return {...state, noMorePosts: data};

        case 'SET_COMMENTS': return {...state, comments: data};
        case 'SET_EXTRA_COMMENTS': return {...state, extraComments: data};
        case 'SET_NO_COMMENTS': return {...state, noComments: data};
        case 'SET_COMMENT_SORT': return {...state, commentSort: data};

        case 'SET_PREVIOUS_URL': return {...state, previousUrl: data};
        case 'SET_PERMALINK_URL': return {...state, permalinkUrl: data};
        case 'SET_SHOW_CONTEXT': return {...state, showContext: data};
        default: return state;
    }
};