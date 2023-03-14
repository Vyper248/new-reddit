import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const StyledUserTable = styled.div`
    max-height: 300px;
    overflow: auto;
    border-radius: 5px;

    & > table {
        width: 100%;
        border-collapse: collapse;

        td {
            border: 1px solid gray;
            padding: 5px;
        }

        td:first-child {
            border-left: none;
        }

        td:last-child {
            border-right: none;
        }

        thead td {
            background-color: rgb(194, 231, 255);
            color: black;
        }
    }
`;

const UserTable = ({headings, data, type, total, username, totalComments}) => {
    const currentSub = useSelector(state => state.currentSub);

    return (
        <StyledUserTable>
            <table>
                <thead>
                    <tr>
                        {
                            headings.map((heading,i) => <td key={i}>{heading}</td>)
                        }
                    </tr>
                </thead>
                {
                    data && data.length > 0 ? (
                        <tbody>
                            {
                                data.map((obj, i) => {
                                    return getCells(obj, i);
                                })
                            }
                        </tbody>
                        
                    ) : <tbody></tbody>
                }
            </table>
        </StyledUserTable>
    );
    
    function getCells(obj, i){
        if (type === 'domains'){
            let url = `https://www.reddit.com/search?q=site%3A${obj.domain}+author%3A${username}+is_self%3A0&restrict_sr=on&sort=new`;
            if (obj.domain.includes('self.')) url = `https://www.reddit.com/r/${obj.domain.replace('self.', '')}/search?q=author%3A${username}+is_self%3A1&restrict_sr=on&sort=new`;
            else if (obj.focusSub) url = `https://www.reddit.com/r/${currentSub}/search?q=site%3A${obj.domain}+author%3A${username}+is_self%3A0&restrict_sr=on&sort=new`;
            return (
                <tr key={i}>
                    <td><a href={url} target="_blank" rel="noopener noreferrer">{obj.domain}</a></td>
                    <td>{obj.count}</td>
                    <td>{((obj.count/total)*100).toFixed(0)}%</td>
                </tr>
            )
        } else if (type === 'subsSubmitted'){
            return (
                <tr key={i}>
                    <td><a href={"https://www.reddit.com/r/"+obj.sub+"/search?q=author%3A"+username+"&restrict_sr=on&sort=new"} target="_blank" rel="noopener noreferrer">{obj.sub}</a></td>
                    <td>{obj.count}</td>
                    <td>{((obj.count/total)*100).toFixed(0)}%</td>
                </tr>
            )
        } else if (type === 'subsCommented'){
            return (
                <tr key={i}>
                    <td>{obj.sub}</td>
                    <td>{obj.count}</td>
                    <td>{((obj.count/totalComments)*100).toFixed(0)}%</td>
                </tr>
            )
        } else if (type === 'accounts'){
            return (
                <tr key={i}>
                    <td><a href={obj.url} target="_blank" rel="noopener noreferrer">{obj.account+' - '+obj.provider}</a></td>
                    <td>{obj.count}</td>
                    <td>{((obj.count/total)*100).toFixed(0)}%</td>
                </tr>
            )
        } else {
            return (
                <tr key={i}></tr>
            )
        }
    }
};

export default UserTable;