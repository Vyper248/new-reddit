(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{17:function(e){e.exports={name:"new-reddit",version:"0.1.0",private:!0,dependencies:{"gh-pages":"^2.0.1",react:"^16.5.2","react-dom":"^16.5.2","react-router-dom":"^4.3.1","react-scripts":"2.0.5"},scripts:{start:"react-scripts start",build:"react-scripts build",test:"react-scripts test",eject:"react-scripts eject",predeploy:"npm run build",deploy:"gh-pages -d build"},eslintConfig:{extends:"react-app"},homepage:"https://vyper248.github.io/new-reddit",startPoint:"/new-reddit",browserslist:[">0.2%","not dead","not ie <= 11","not op_mini all"]}},19:function(e,t,a){e.exports=a(44)},24:function(e,t,a){},28:function(e,t,a){},34:function(e,t,a){},36:function(e,t,a){},38:function(e,t,a){},40:function(e,t,a){},42:function(e,t,a){},44:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(18),s=a.n(o),c=(a(24),a(6)),i=a.n(c),l=a(14),m=a(7),d=a(8),u=a(12),p=a(9),h=a(13),v=a(49),g=a(48),f=a(45),b=a(47),E=a(46),k=(a(28),a(17)),y=function(e){var t=k.startPoint;return r.a.createElement("div",{className:"subLinks"},["PSVR","PS4","Apple","iPhone","NoMansSkyTheGame","Minecraft","PS4Deals"].map(function(e,a){var n=t+"/"+e;return r.a.createElement(E.a,{className:"navLink",activeClassName:"active",key:a,to:n},e)}))},w=(a(34),function(){return r.a.createElement("div",{className:"loadingSpinner"})}),N=a(33),S=(a(36),function(e){var t=e.post,a=r.a.createElement("div",{className:"postThumbnail"},r.a.createElement("img",{src:t.thumbnail,alt:"Thumbnail for post"}));!1===/(.jpg|.png|.bmp|.jpeg)/.test(t.thumbnail)&&(a=r.a.createElement("span",null));var n=r.a.createElement("div",{className:"postLinkBody",dangerouslySetInnerHTML:{__html:t.body}}),o=!1;t.url.match(/.jpg$/)&&(n=r.a.createElement("div",{className:"postLinkBody"},r.a.createElement("img",{src:t.url,alt:"Preview user linked to"})),o=!0),t.media.length>0&&(t.body.length>0&&(t.media+="<br/>"+t.body),n=r.a.createElement("div",{className:"postLinkBody",dangerouslySetInnerHTML:{__html:t.media}}),o=!0);var s=r.a.createElement("span",null," - ",r.a.createElement("span",{className:"postLinkOpen",onClick:function(e){e.preventDefault();var t=e.target.parentNode.parentNode.parentNode.querySelector(".postLinkBody");t.classList.toggle("open"),t.classList.contains("open")?e.target.innerText="[ - ] ":e.target.innerText="[ + ] "}},"[ + ] "));0===t.body.length&&!1===o&&(s=r.a.createElement("span",null));var c="postLink";return t.stickied&&(c+=" stickied"),r.a.createElement("div",{className:c},a,r.a.createElement("div",{className:"postLinkContent"},r.a.createElement(N.a,{to:"".concat(t.subreddit,"/").concat(t.id),className:"postLinkTitle"},t.title),r.a.createElement("div",{className:"postLinkMiddle"},r.a.createElement("a",{className:"postLinkDomain",href:t.url,target:"_blank",rel:"noopener noreferrer"},t.domain," - "),r.a.createElement("span",{className:"postLinkAuthor"},t.author),s),n,r.a.createElement("div",{className:"postLinkFooter"},r.a.createElement(N.a,{to:"".concat(t.subreddit,"/").concat(t.id),className:"postLinkComments"},t.num_comments," Comments "),"- ",r.a.createElement("a",{className:"postLinkReddit",href:"https://www.reddit.com"+t.permalink,target:"_blank",rel:"noopener noreferrer"},"Open on Reddit"))))}),L=(a(38),function(e){var t=e.posts;return t&&0===t.length?r.a.createElement(w,null):t?r.a.createElement("div",{className:"postListDiv"},t.map(function(e){return r.a.createElement(S,{key:e.id,post:e})})):r.a.createElement("div",{className:"postListDiv"},"No Posts Found")}),x=(a(40),function(e){function t(){return Object(m.a)(this,t),Object(u.a)(this,Object(p.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this.props,t=e.comment,a=e.author,n="";return t.replies.length>0&&(n=r.a.createElement(C,{comments:t.replies,author:a})),r.a.createElement("div",{className:"commentDiv"},r.a.createElement("div",{className:"commentHeader"},r.a.createElement("span",{className:"commentClose",onClick:function(e){e.preventDefault();var t=e.target.parentNode.parentNode;t.classList.toggle("closed"),t.classList.contains("closed")?e.target.innerText="[ + ] ":e.target.innerText="[ - ] "}},"[ - ] "),r.a.createElement("span",{className:t.author===a?"commentAuthor OP":"commentAuthor"},t.author),r.a.createElement("span",{className:"commentScore"}," | ",t.score)),r.a.createElement("div",{className:"commentText",dangerouslySetInnerHTML:{__html:t.body_html}}),r.a.createElement("div",{className:"commentFooter"},r.a.createElement("a",{className:"commentPermalink",target:"_blank",rel:"noopener noreferrer",href:"http://www.reddit.com"+t.permalink},"Permalink")),n)}}]),t}(n.Component)),C=function(e){var t=e.comments,a=e.author;return t&&t.length>0?r.a.createElement("div",{className:"comments"},t.map(function(e){return e.author?r.a.createElement(x,{key:e.id,comment:e,author:a}):null})):t?r.a.createElement("div",null):t?void 0:r.a.createElement(w,null)},M=function(e){var t=e.onClick,a=e.currentSort,n={1:["Hot","New","Rising","Controversial","Top"],2:["Best","New","Top","Controversial","Old","Q&A"]}[e.sortList];return r.a.createElement("div",{className:"sortButtons"},n.map(function(e,n){var o="sortButton";return e.toLowerCase()===a?o+=" active":"best"===e.toLowerCase()&&"confidence"===a?o+=" active":"q&a"===e.toLowerCase()&&"qa"===a&&(o+=" active"),r.a.createElement("span",{key:n,className:o,onClick:t},e.toLowerCase())}))},j=(a(42),function(e){var t=e.postDetails,a=t.title,n=t.body,o=t.comments,s=t.url,c=t.media,i=t.author,l=e.currentSort,m=e.commentSortMethod,d=r.a.createElement("div",{dangerouslySetInnerHTML:{__html:n}});/.(png|jpg|jpeg|bmp)$/.test(s)&&(d=r.a.createElement("img",{src:s,alt:"Preview of content"}));var u=s||"";return u.length>40&&(u=u.substr(0,40)+"..."),c&&c.length>0&&(n.length>0&&(c+="<br/>"+n),d=r.a.createElement("div",{dangerouslySetInnerHTML:{__html:c}})),r.a.createElement("div",null,0===a.length?r.a.createElement("h1",{className:"loading"},"Loading..."):r.a.createElement("div",{className:"postDiv"},r.a.createElement("h1",null,a),r.a.createElement("div",{className:"postMiddle"},r.a.createElement("span",null,i),r.a.createElement("a",{className:"postGoToURL",href:s,target:"_blank",rel:"noopener noreferrer"}," | Go to URL (",u,")")),d,r.a.createElement(M,{onClick:m,currentSort:l,sortList:2}),r.a.createElement("hr",null),r.a.createElement(C,{comments:o,author:i})))}),T=function(e){var t=e.heading,a=e.onReload;return r.a.createElement("h1",{className:"subHeader"},t," ",r.a.createElement("span",{className:"reloadButton",onClick:a},"\u21bb"))},_=a(17),D=function(e){function t(){var e;return Object(m.a)(this,t),(e=Object(u.a)(this,Object(p.a)(t).call(this))).onReload=function(){e.checkUrlAndUpdate(!0)},e.onChangeSortMethod=function(t){var a=t.target.innerText.toLowerCase();e.setState({sortMethod:a})},e.onChangeCommentSortMethod=function(t){var a=t.target.innerText.toLowerCase();switch(a){case"best":e.setState({commentSortMethod:"confidence"});break;case"q&a":e.setState({commentSortMethod:"qa"});break;default:e.setState({commentSortMethod:a})}},e.getPostList=function(){var t=Object(l.a)(i.a.mark(function t(a){var n,r,o,s;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a.length>0&&(a="r/"+a),t.prev=1,n="https://www.reddit.com/"+a+"/"+e.state.sortMethod+"/.json",0===a.length&&(n="https://www.reddit.com/.json"),t.next=6,fetch(n);case 6:return r=t.sent,t.next=9,r.json();case 9:(o=t.sent).error?e.setState({posts:null}):o&&o.data&&o.data.children&&(0===(s=o.data.children.map(function(t){var a=t.data,n=a.media;return n=n&&n.oembed?e.parseBodyText(n.oembed.html):"",{author:a.author,domain:a.domain,title:e.parseBodyText(a.title),id:a.id,body:e.parseBodyText(a.selftext_html),num_comments:a.num_comments,score:a.score,subreddit:a.subreddit,stickied:a.stickied,url:a.url,thumbnail:a.thumbnail,permalink:a.permalink,media:n}})).length&&(s=null),e.setState({posts:s})),t.next=17;break;case 13:t.prev=13,t.t0=t.catch(1),console.log(t.t0),e.setState({posts:null});case 17:case"end":return t.stop()}},t,this,[[1,13]])}));return function(e){return t.apply(this,arguments)}}(),e.getPostDetails=function(){var t=Object(l.a)(i.a.mark(function t(a){var n,r,o,s,c,l,m,d,u,p;return i.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,fetch("https://www.reddit.com/r/"+a+".json?sort="+e.state.commentSortMethod);case 3:return n=t.sent,t.next=6,n.json();case 6:(r=t.sent).error?e.setState({postDetails:{title:"Not Found",body:"",id:""}}):(o=r[0].data.children[0].data,s=o.title,c=o.selftext_html,l=o.id,m=o.url,d=o.media,u=o.author,p=r[1].data.children.map(function(t){return e.parseComment(t.data)}),d=d&&d.oembed?e.parseBodyText(d.oembed.html):"",c=e.parseBodyText(c),e.setState({postDetails:{title:s,body:c,id:l,url:m,media:d,comments:p,author:u}})),t.next=13;break;case 10:t.prev=10,t.t0=t.catch(0),console.log(t.t0);case 13:case"end":return t.stop()}},t,this,[[0,10]])}));return function(e){return t.apply(this,arguments)}}(),e.state={sub:"",postId:"",sortMethod:"hot",commentSortMethod:"new",posts:[],postDetails:{title:"",body:"",id:"",comments:[]}},e}return Object(h.a)(t,e),Object(d.a)(t,[{key:"render",value:function(){var e=this,t=_.startPoint;return r.a.createElement("div",null,r.a.createElement(y,null),r.a.createElement(T,{heading:this.state.sub,onReload:this.onReload}),r.a.createElement(M,{onClick:this.onChangeSortMethod,currentSort:this.state.sortMethod,sortList:1}),r.a.createElement("hr",null),r.a.createElement(v.a,null,r.a.createElement(g.a,{exact:!0,path:"/",to:t+"/"}),r.a.createElement(f.a,{exact:!0,path:t+"/",render:function(t){return r.a.createElement(L,Object.assign({},t,{posts:e.state.posts}))}}),r.a.createElement(f.a,{exact:!0,path:t+"/:sub",render:function(t){return r.a.createElement(L,Object.assign({},t,{posts:e.state.posts}))}}),r.a.createElement(f.a,{exact:!0,path:t+"/:sub/:post",render:function(t){return r.a.createElement(j,Object.assign({},t,{postDetails:e.state.postDetails,commentSortMethod:e.onChangeCommentSortMethod,currentSort:e.state.commentSortMethod}))}})))}},{key:"parseBodyText",value:function(e){return e=e?e.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;#39;/g,"'").replace(/&amp;quot;/g,'"').replace(/&amp;/g,"&").replace(/&#x200B;/g," "):""}},{key:"parseComment",value:function(e){var t=this,a=e.body_html,n=e.id,r=e.author,o=e.permalink,s=e.replies,c=e.score;return{body_html:a=this.parseBodyText(a),id:n,author:r,permalink:o,replies:s=(s="object"===typeof s?s.data.children:[]).map(function(e){return t.parseComment(e.data)}),score:c}}},{key:"checkUrlAndUpdate",value:function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=_.startPoint,a=this.props.location.pathname.replace(t,"").replace("/",""),n=a.split("/");if(1===n.length){var r=n[0];(r!==this.state.sub||e)&&(this.setState({sub:r,posts:[]}),this.getPostList(a))}else if(2===n.length){var o=n[0],s=n[1];if((o!==this.state.sub||e)&&(this.setState({sub:o,posts:[]}),this.getPostList(o)),s!==this.state.postId||e){var c=(this.state.posts||[]).find(function(e){return e.id===s});c?this.setState({sub:o,postId:s,postDetails:c}):this.setState({sub:o,postId:s,postDetails:{title:"",body:"",id:""}}),this.getPostDetails("".concat(o,"/").concat(s))}}}},{key:"componentDidUpdate",value:function(e,t){var a=!1;t.sortMethod!==this.state.sortMethod&&(a=!0),t.commentSortMethod!==this.state.commentSortMethod&&(a=!0),this.checkUrlAndUpdate(a)}},{key:"componentDidMount",value:function(){this.checkUrlAndUpdate(!0)}}]),t}(n.Component),O=function(){return r.a.createElement(b.a,null,r.a.createElement(f.a,{path:"/",component:D}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));s.a.render(r.a.createElement(O,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[19,2,1]]]);
//# sourceMappingURL=main.8fbc36ff.chunk.js.map