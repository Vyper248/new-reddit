(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{18:function(e,t,a){e.exports=a(43)},23:function(e,t,a){},27:function(e,t,a){},33:function(e,t,a){},35:function(e,t,a){},37:function(e,t,a){},39:function(e,t,a){},41:function(e,t,a){},43:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(16),s=a.n(o),c=(a(23),a(5)),l=a.n(c),i=a(13),m=a(6),u=a(7),d=a(11),p=a(8),h=a(12),v=a(47),f=a(44),g=a(46),b=a(45),E=(a(27),function(){return r.a.createElement("div",{className:"subLinks"},["PSVR","PS4","Apple","iPhone","NoMansSkyTheGame","Minecraft","PS4Deals"].map(function(e,t){var a="/"+e;return r.a.createElement(b.a,{className:"navLink",activeClassName:"active",key:t,to:a},e)}))}),k=(a(33),function(){return r.a.createElement("div",{className:"loadingSpinner"})}),y=a(32),N=(a(35),function(e){var t=e.sub,a=e.post,n=r.a.createElement("div",{className:"postThumbnail"},r.a.createElement("img",{src:a.thumbnail,alt:"Thumbnail for post"}));!1===/(.jpg|.png|.bmp|.jpeg)/.test(a.thumbnail)&&(n=r.a.createElement("span",null));var o=r.a.createElement("div",{className:"postLinkBody",dangerouslySetInnerHTML:{__html:a.body}}),s=!1;a.url.match(/.jpg$/)&&(o=r.a.createElement("div",{className:"postLinkBody"},r.a.createElement("img",{src:a.url,alt:"Preview user linked to"})),s=!0),a.media.length>0&&(a.body.length>0&&(a.media+="<br/>"+a.body),o=r.a.createElement("div",{className:"postLinkBody",dangerouslySetInnerHTML:{__html:a.media}}),s=!0);var c=r.a.createElement("span",null," - ",r.a.createElement("span",{className:"postLinkOpen",onClick:function(e){e.preventDefault();var t=e.target.parentNode.parentNode.parentNode.querySelector(".postLinkBody");t.classList.toggle("open"),t.classList.contains("open")?e.target.innerText="[ - ] ":e.target.innerText="[ + ] "}},"[ + ] "));0===a.body.length&&!1===s&&(c=r.a.createElement("span",null));var l="postLink";return a.stickied&&(l+=" stickied"),r.a.createElement("div",{className:l},n,r.a.createElement("div",{className:"postLinkContent"},r.a.createElement(y.a,{to:"".concat(t,"/").concat(a.id),className:"postLinkTitle"},a.title),r.a.createElement("div",{className:"postLinkMiddle"},r.a.createElement("a",{className:"postLinkDomain",href:a.url,target:"_blank",rel:"noopener noreferrer"},a.domain," - "),r.a.createElement("span",{className:"postLinkAuthor"},a.author),c),o,r.a.createElement("div",{className:"postLinkFooter"},r.a.createElement(y.a,{to:"".concat(t,"/").concat(a.id),className:"postLinkComments"},a.num_comments," Comments "),"- ",r.a.createElement("a",{className:"postLinkReddit",href:"https://www.reddit.com"+a.permalink,target:"_blank",rel:"noopener noreferrer"},"Open on Reddit"))))}),S=(a(37),function(e){var t=e.posts,a=e.sub;return t&&0===t.length?r.a.createElement(k,null):t?r.a.createElement("div",{className:"postListDiv"},t.map(function(e){return r.a.createElement(N,{key:e.id,post:e,sub:a})})):r.a.createElement("div",{className:"postListDiv"},"No Posts Found")}),w=(a(39),function(e){function t(){return Object(m.a)(this,t),Object(d.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this.props,t=e.comment,a=e.author,n="";return t.replies.length>0&&(n=r.a.createElement(L,{comments:t.replies,author:a})),r.a.createElement("div",{className:"commentDiv"},r.a.createElement("div",{className:"commentHeader"},r.a.createElement("span",{className:"commentClose",onClick:function(e){e.preventDefault();var t=e.target.parentNode.parentNode;t.classList.toggle("closed"),t.classList.contains("closed")?e.target.innerText="[ + ] ":e.target.innerText="[ - ] "}},"[ - ] "),r.a.createElement("span",{className:t.author===a?"commentAuthor OP":"commentAuthor"},t.author),r.a.createElement("span",{className:"commentScore"}," | ",t.score)),r.a.createElement("div",{className:"commentText",dangerouslySetInnerHTML:{__html:t.body_html}}),r.a.createElement("div",{className:"commentFooter"},r.a.createElement("a",{className:"commentPermalink",target:"_blank",rel:"noopener noreferrer",href:"http://www.reddit.com"+t.permalink},"Permalink")),n)}}]),t}(n.Component)),L=function(e){var t=e.comments,a=e.author;return t&&t.length>0?r.a.createElement("div",{className:"comments"},t.map(function(e){return e.author?r.a.createElement(w,{key:e.id,comment:e,author:a}):null})):t?r.a.createElement("div",null):t?void 0:r.a.createElement(k,null)},C=function(e){var t=e.onClick,a=e.currentSort,n={1:["Hot","New","Rising","Controversial","Top"],2:["Best","New","Top","Controversial","Old","Q&A"]}[e.sortList];return r.a.createElement("div",{className:"sortButtons"},n.map(function(e,n){var o="sortButton";return e.toLowerCase()===a?o+=" active":"best"===e.toLowerCase()&&"confidence"===a?o+=" active":"q&a"===e.toLowerCase()&&"qa"===a&&(o+=" active"),r.a.createElement("span",{key:n,className:o,onClick:t},e.toLowerCase())}))},M=(a(41),function(e){var t=e.postDetails,a=t.title,n=t.body,o=t.comments,s=t.url,c=t.media,l=t.author,i=e.currentSort,m=e.commentSortMethod,u=r.a.createElement("div",{dangerouslySetInnerHTML:{__html:n}});/.(png|jpg|jpeg|bmp)$/.test(s)&&(u=r.a.createElement("img",{src:s,alt:"Preview of content"}));var d=s||"";return d.length>40&&(d=d.substr(0,40)+"..."),c&&c.length>0&&(n.length>0&&(c+="<br/>"+n),u=r.a.createElement("div",{dangerouslySetInnerHTML:{__html:c}})),r.a.createElement("div",null,0===a.length?r.a.createElement("h1",{className:"loading"},"Loading..."):r.a.createElement("div",{className:"postDiv"},r.a.createElement("h1",null,a),r.a.createElement("div",{className:"postMiddle"},r.a.createElement("span",null,l),r.a.createElement("a",{className:"postGoToURL",href:s,target:"_blank",rel:"noopener noreferrer"}," | Go to URL (",d,")")),u,r.a.createElement(C,{onClick:m,currentSort:i,sortList:2}),r.a.createElement("hr",null),r.a.createElement(L,{comments:o,author:l})))}),x=function(e){var t=e.heading,a=e.onReload;return r.a.createElement("h1",{className:"subHeader"},t," ",r.a.createElement("span",{className:"reloadButton",onClick:a},"\u21bb"))},j=function(e){function t(){var e;return Object(m.a)(this,t),(e=Object(d.a)(this,Object(p.a)(t).call(this))).onReload=function(){e.checkUrlAndUpdate(!0)},e.onChangeSortMethod=function(t){var a=t.target.innerText.toLowerCase();e.setState({sortMethod:a})},e.onChangeCommentSortMethod=function(t){var a=t.target.innerText.toLowerCase();switch(a){case"best":e.setState({commentSortMethod:"confidence"});break;case"q&a":e.setState({commentSortMethod:"qa"});break;default:e.setState({commentSortMethod:a})}},e.getPostList=function(){var t=Object(i.a)(l.a.mark(function t(a){var n,r,o,s;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a.length>0&&(a="r/"+a),t.prev=1,n="https://www.reddit.com/"+a+"/"+e.state.sortMethod+"/.json",0===a.length&&(n="https://www.reddit.com/.json"),t.next=6,fetch(n);case 6:return r=t.sent,t.next=9,r.json();case 9:(o=t.sent).error?e.setState({posts:null}):o&&o.data&&o.data.children&&(0===(s=o.data.children.map(function(t){var a=t.data,n=a.media;return n=n&&n.oembed?e.parseBodyText(n.oembed.html):"",{author:a.author,domain:a.domain,title:e.parseBodyText(a.title),id:a.id,body:e.parseBodyText(a.selftext_html),num_comments:a.num_comments,score:a.score,subreddit:a.subreddit,stickied:a.stickied,url:a.url,thumbnail:a.thumbnail,permalink:a.permalink,media:n}})).length&&(s=null),e.setState({posts:s})),t.next=17;break;case 13:t.prev=13,t.t0=t.catch(1),console.log(t.t0),e.setState({posts:null});case 17:case"end":return t.stop()}},t,this,[[1,13]])}));return function(e){return t.apply(this,arguments)}}(),e.getPostDetails=function(){var t=Object(i.a)(l.a.mark(function t(a){var n,r,o,s,c,i,m,u,d,p;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("https://www.reddit.com/r/"+a+".json?sort="+e.state.commentSortMethod);case 3:return n=t.sent,t.next=6,n.json();case 6:(r=t.sent).error?e.setState({postDetails:{title:"Not Found",body:"",id:""}}):(o=r[0].data.children[0].data,s=o.title,c=o.selftext_html,i=o.id,m=o.url,u=o.media,d=o.author,p=r[1].data.children.map(function(t){return e.parseComment(t.data)}),u=u&&u.oembed?e.parseBodyText(u.oembed.html):"",c=e.parseBodyText(c),e.setState({postDetails:{title:s,body:c,id:i,url:m,media:u,comments:p,author:d}})),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),console.log(t.t0);case 13:case"end":return t.stop()}},t,this,[[0,10]])}));return function(e){return t.apply(this,arguments)}}(),e.state={sub:"",postId:"",sortMethod:"hot",commentSortMethod:"new",posts:[],postDetails:{title:"",body:"",id:"",comments:[]}},e}return Object(h.a)(t,e),Object(u.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(E,null),r.a.createElement(x,{heading:this.state.sub,onReload:this.onReload}),r.a.createElement(C,{onClick:this.onChangeSortMethod,currentSort:this.state.sortMethod,sortList:1}),r.a.createElement("hr",null),r.a.createElement(v.a,null,r.a.createElement(f.a,{exact:!0,path:"/",render:function(t){return r.a.createElement(S,Object.assign({},t,{posts:e.state.posts,sub:e.state.sub}))}}),r.a.createElement(f.a,{exact:!0,path:"/:sub",render:function(t){return r.a.createElement(S,Object.assign({},t,{posts:e.state.posts,sub:e.state.sub}))}}),r.a.createElement(f.a,{exact:!0,path:"/:sub/:post",render:function(t){return r.a.createElement(M,Object.assign({},t,{postDetails:e.state.postDetails,commentSortMethod:e.onChangeCommentSortMethod,currentSort:e.state.commentSortMethod}))}})))}},{key:"parseBodyText",value:function(e){return e=e?e.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;#39;/g,"'").replace(/&amp;quot;/g,'"').replace(/&amp;/g,"&").replace(/&#x200B;/g," "):""}},{key:"parseComment",value:function(e){var t=this,a=e.body_html,n=e.id,r=e.author,o=e.permalink,s=e.replies,c=e.score;return{body_html:a=this.parseBodyText(a),id:n,author:r,permalink:o,replies:s=(s="object"===typeof s?s.data.children:[]).map(function(e){return t.parseComment(e.data)}),score:c}}},{key:"checkUrlAndUpdate",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=this.props.location.pathname.replace("/",""),a=this.props.location.pathname.match(/\//g);if(1===(a=a?a.length:0))(t!==this.state.sub||e)&&(this.setState({sub:t,posts:[]}),this.getPostList(t));else if(2===a){var n=t.replace(/\/[a-zA-Z0-9]+/,""),r=t.replace(/[a-zA-Z0-9]+\//,"");if((n!==this.state.sub||e)&&(this.setState({sub:n,posts:[]}),this.getPostList(n)),r!==this.state.postId||e){var o=this.state.posts.find(function(e){return e.id===r});o?this.setState({sub:n,postId:r,postDetails:o}):this.setState({sub:n,postId:r,postDetails:{title:"",body:"",id:""}}),this.getPostDetails("".concat(n,"/").concat(r))}}}},{key:"componentDidUpdate",value:function(e,t){var a=!1;t.sortMethod!==this.state.sortMethod&&(a=!0),t.commentSortMethod!==this.state.commentSortMethod&&(a=!0),this.checkUrlAndUpdate(a)}},{key:"componentDidMount",value:function(){this.checkUrlAndUpdate(!0)}}]),t}(n.Component),T=function(){return r.a.createElement(g.a,null,r.a.createElement(f.a,{path:"/",component:j}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(T,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[18,2,1]]]);
//# sourceMappingURL=main.d277e721.chunk.js.map