import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import './SubList.css';
let pjson = require('../../package.json');

class SubList extends Component {
// const SubList = (props) => {
    constructor(){
        super();
        this.state = {
            subs: [],
            newSub: '',
            editMode: false
        }
    }
    
    render(){
        let props = this.props;
        let startPoint = pjson.startPoint;
        //temp sub list (maybe change to browser storage?)
        const {subs, newSub} = this.state;
        
        return (
            <div className="subLinks">
                {
                    subs.map((sub,i) => {
                        const link = startPoint+'/'+sub;
                        return (
                            <div className="subContainer sideBarRow" key={i}>
                                <NavLink className="navLink" activeClassName="active" to={link} onClick={props.onClick}>
                                    {sub}
                                </NavLink>
                                {
                                    this.state.editMode ? <button className="deleteSubBtn" onClick={this.onDeleteSub(sub)}><div>+</div></button> : null 
                                }
                            </div>
                        )
                    })
                }
                <div className="newSubDiv">
                    <input className="newSubInput sideBarRow" type="text" placeholder="New Sub" onChange={this.onChangeNewSub} value={newSub}/>
                    <button className="newSubBtn sideBarRow" onClick={this.onAddNewSub}>Add</button>
                </div>
                <img className="editSubIcon" src="edit-solid.svg" onClick={this.onToggleEditMode}/>
            </div>
        );
    }
    
    componentDidMount(){
        // const subs = ['PSVR','PS4','Apple','iPhone','NoMansSkyTheGame','Minecraft','PS4Deals','PS4Dreams','FirewallZeroHour'];
        let subs = localStorage.getItem('subs');
        subs = subs ? JSON.parse(subs) : [];
        this.setState({subs});
    }
    
    onChangeNewSub = (e) => {
        this.setState({newSub: e.target.value});
    }
    
    onAddNewSub = () => {
        const {subs, newSub} = this.state;
        if (subs.includes(newSub)) return this.setState({newSub: ''});
        subs.push(newSub);
        this.setState({subs, newSub:''});
        localStorage.setItem('subs', JSON.stringify(subs));
    }
    
    onDeleteSub = (sub) => () => {
        const subs = this.state.subs.filter(subName => subName !== sub);
        this.setState({subs});
        localStorage.setItem('subs', JSON.stringify(subs));
    }
    
    onToggleEditMode = () => {
        this.setState({editMode: !this.state.editMode});
    }
};

export default SubList;