import React, {Component} from 'react';
import Comments from './Comments';
import './Comment.css';

class Comment extends Component {
    render(){
        let {comment, author} = this.props;
        
        //if there are any replies to this comment, create a new Comments object (will work recursively)
        let replies = "";
        if (comment.replies.length > 0){
            replies = <Comments comments={comment.replies} author={author}/>;
        }
        
        function toggleCommentClose(e){
            e.preventDefault();
            const commentDiv = e.target.parentNode.parentNode;
            commentDiv.classList.toggle('closed');
            if (commentDiv.classList.contains('closed')) e.target.innerText = '[ + ] ';
            else e.target.innerText = '[ - ] ';
        }
        
        //make sure any links within the body open in a new tab
        comment.body_html = comment.body_html.replace(/<a/g, '<a target="_blank" rel="noopener noreferrer"');
        
        //make sure links to reddit are adjusted
        comment.body_html = comment.body_html.replace(/href="\/(r|u)/, 'href="https://www.reddit.com/$1');
        
        return (
            <div className="commentDiv">
                <div className="commentHeader">
                    <span className="commentClose" onClick={toggleCommentClose}>[ - ] </span>
                    <span className={comment.author === author ? "commentAuthor OP" : "commentAuthor"}>{comment.author}</span><span className="commentScore"> | {comment.score}</span>
                </div>
                
                <div className="commentText" dangerouslySetInnerHTML={{ __html: comment.body_html }}></div>
                
                <div className="commentFooter">
                    <a className="commentPermalink" target="_blank" rel="noopener noreferrer" href={"http://www.reddit.com"+comment.permalink}>Permalink</a>
                </div>
                {replies}
            </div>
        );
    }
}
// const Comment = (props) => {
// 
// }

export default Comment;