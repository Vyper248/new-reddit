import React, {Component} from 'react';

class Post extends Component {
    constructor({match}){
        super();
        this.match = match;
        this.state = {
            title: '',
            body: '',
        };
    }
    
    render(){
        return (
            <div>
                {
                    this.state.title.length === 0 ? <h1>Loading...</h1> : (
                        <div>
                            <h1>{this.state.title}</h1>
                            <div dangerouslySetInnerHTML={{ __html: this.state.body }}></div>
                        </div>
                    )
                }
            </div>
        );
    }
    
    componentDidMount(){
        let {sub, post} = this.match.params;
        this.getPostDetails(`${sub}/comments/${post}.json`);
    }
    
    getPostDetails = async (url) => {
        try {
            let response = await fetch('https://www.reddit.com/r/'+url);
            let data = await response.json();
            
            if (data.error){
                this.setState({title: 'Not Found', body: ''});
            } else {
                let {title, selftext_html} = data[0].data.children[0].data;
                //if this exists, replace &lt etc with proper symbols, otherwise set to empty string
                selftext_html ? selftext_html = selftext_html.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;#39;/g,"'") : selftext_html = '';
                this.setState({title, body: selftext_html});
            }
        } catch (error) {
            console.log(error);
        }
            
    };
}

// const Post = ({title, body}) => {
//     return (
//         <div>
//             {
//                 title.length === 0 ? <h1>Loading...</h1> : (
//                     <div>
//                         <h1>{title}</h1>
//                         <div dangerouslySetInnerHTML={{ __html: body }}></div>
//                     </div>
//                 )
//             }
//         </div>
//     );
// }

export default Post;