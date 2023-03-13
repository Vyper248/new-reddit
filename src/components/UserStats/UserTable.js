import React from 'react';
import styled from 'styled-components';

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
            return (
                <tr key={i}>
                    <td>{obj.domain}</td>
                    <td>{obj.count}</td>
                    <td>{((obj.count/total)*100).toFixed(0)}%</td>
                </tr>
            )
        } else if (type === 'subsSubmitted'){
            return (
                <tr key={i}>
                    <td><a href={"https://www.reddit.com/r/"+obj.sub+"/search?q=author%3A"+username+"&restrict_sr=on&sort=new&feature=legacy_search"} target="_blank" rel="noopener noreferrer">{obj.sub}</a></td>
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