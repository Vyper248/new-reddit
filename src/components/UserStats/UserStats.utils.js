export const gatherData = async (username='', setData, controller, ignoreComments) => {
    if (username.length > 0){        
        const submissions = [];
        await getSubmissions(username, submissions, setData, controller);

        if (ignoreComments) return;
        await getComments(username, [], submissions, setData, controller);
    }
}

const getSubmissions = async (username, submissions, setData, controller, after = '') => {
    if (username.length === 0) return;

    try {
        const resp = await fetch('https://www.reddit.com/user/'+username+'/submitted.json?limit=100&after='+after, {signal: controller.signal});
        const json = await resp.json();
        
        submissions.push(...json.data.children);
        let data = analyseData(submissions, [], false, username, '');
        setData(data)(submissions, []);
        
        if (json.data.after !== null){
            await getSubmissions(username, submissions, setData, controller, json.data.after);
        }
    } catch (err) {
        // console.log('getSubmissions: ', err);
    }
}

const getComments = async (username, comments, submissions, setData, controller, after = '') => {
    if (username.length === 0) return;

    try {
        const resp = await fetch('https://www.reddit.com/user/'+username+'/comments.json?limit=100&after='+after, {signal: controller.signal});
        const json = await resp.json();
        
        comments.push(...json.data.children);
        let data = analyseData(submissions, comments, false, username, '');
        setData(data)(submissions, comments);
        
        if (json.data.after !== null){
            await getComments(username, comments, submissions, setData, controller, json.data.after);
        }
    } catch (err) {
        // console.log('getComments', err);
    }
}

export const analyseData = (submissionData, commentData, ignoreProfile, username, focusSub) => {    
    let submissionCount = 0;
    const domainsSubmittedFrom = [];
    const subsSubmittedTo = [];
    const accountsSubmittedFrom = [];
    const subsCommentedTo = [];
    
    submissionData.forEach(submission => {
        let data = submission.data;
        if (ignoreProfile && data.subreddit.toLowerCase() === 'u_'+username.toLowerCase()) return;
        submissionCount++;
        addSubSubmitted(data, subsSubmittedTo);
        if (focusSub.length > 0 && data.subreddit.toLowerCase() !== focusSub.toLowerCase()) return;
        addDomain(data, domainsSubmittedFrom);                    
        addAccount(data, accountsSubmittedFrom);
    });
    
    commentData.forEach(comment => {
        let data = comment.data;
        addSubCommentedTo(data, subsCommentedTo);
    });
    
    domainsSubmittedFrom.sort((a,b) => b.count-a.count);
    subsSubmittedTo.sort((a,b) => b.count-a.count);
    accountsSubmittedFrom.sort((a,b) => b.count-a.count);
    subsCommentedTo.sort((a,b) => b.count-a.count);

    return { submissionCount, domainsSubmittedFrom, subsSubmittedTo, accountsSubmittedFrom, subsCommentedTo };
}

const addDomain = (data, domainsSubmittedFrom) => {
    let domain = data.domain;
    let existingObj = domainsSubmittedFrom.find(obj => obj.domain === domain);
    if (existingObj === undefined){
        domainsSubmittedFrom.push({domain, count:1});
    } else {
        existingObj.count++;
    }
}

const addSubSubmitted = (data, subsSubmittedTo) => {
    let sub = data.subreddit;
    let existingObj = subsSubmittedTo.find(obj => obj.sub === sub);
    if (existingObj === undefined){
        subsSubmittedTo.push({sub, count:1});
    } else {
        existingObj.count++;
    }
}

const addAccount = (data, accountsSubmittedFrom) => {
    let account, accountLink, provider;
    
    if (data.media && data.media.type === 'youtube.com'){
        account = data.media.oembed.author_name;
        accountLink = data.media.oembed.author_url;
        provider = data.media.oembed.provider_name;
    } else if (data.domain === 'twitter.com') {
        account = data.url.replace('https://twitter.com/','');
        let end = account.indexOf('/');
        account = account.slice(0, end);
        accountLink = data.url;
        provider = 'Twitter';
    } else if (data.media && data.media.type === 'twitch.tv'){
        account = data.media.oembed.title.replace(' - Twitch', '');
        provider = data.media.oembed.provider_name;
        accountLink = data.url;
    } else {
        return;
    }
    
    let existingObj = accountsSubmittedFrom.find(obj => obj.account === account);
    if (existingObj === undefined){
        accountsSubmittedFrom.push({account, count:1, url: accountLink, provider});
    } else {
        existingObj.count++;
    }
}

const addSubCommentedTo = (data, subsCommentedTo) => {
    let sub = data.subreddit;
    let existingObj = subsCommentedTo.find(obj => obj.sub === sub);
    if (existingObj === undefined){
        subsCommentedTo.push({sub, count:1});
    } else {
        existingObj.count++;
    }
}