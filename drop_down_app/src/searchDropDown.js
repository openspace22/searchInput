import React, { Component } from "react";
import './searchDropDown.css';
/*
 props : 
    searchable
    multiselect
    displayKey
    data arr

 state : selected values       

*/

class SearchDropDown extends Component{
    constructor(props){
        super(props);
        this.openCloseDropDown = this.openCloseDropDown.bind(this);
        this.selectUnselectSingleVal = this.selectUnselectSingleVal.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.onSelectLi = this.onSelectLi.bind(this);
        this.filterVal = this.filterVal.bind(this);
        this.state = {
            tempSelectedValues: [],
            value: "",
            selectedValue: [],
            dataArr: [],
            showDropDown: false
        }
    }
    openCloseDropDown = (action)=>{
        if(action == 'open'){
            this.setState({
                showDropDown: true,
                tempSelectedValues: [...this.state.selectedValue],
                value: "",
                dataArr: this.props.dataArr || [1,2,3,4,5]
            })
        }else{
            this.setState({
                showDropDown: false
            })
        }
    }
    selectUnselectSingleVal = (isSelected,matchVal) =>{
        let tempSelectedValues = [...this.state.tempSelectedValues];
        let index = -1;
        if((index = tempSelectedValues.indexOf(matchVal)) > -1){
            tempSelectedValues.splice(index,1);
        } 
        if(isSelected){
            tempSelectedValues.push(matchVal);
        }
        this.setState({
            tempSelectedValues
        });
    }
    onChangeCheckBox = (event,matchVal) =>{
        this.selectUnselectSingleVal(event.target.checked,matchVal);
    }
    onSelectLi = (matchVal) =>{
        this.selectUnselectSingleVal(!(this.state.tempSelectedValues.indexOf(matchVal) > -1),matchVal);
        if(!this.props.multiSelect){
            this.setState((prvState)=>({
                showDropDown: false,
                value: prvState.tempSelectedValues ? prvState.tempSelectedValues.toString() : "",
                selectedValue: [...(prvState.tempSelectedValues || [])]
            }))
            
        }
    }
    clearSelection = () =>{
        this.setState({
            tempSelectedValues: [],
            showDropDown: false,
            selectedValue: [],
            value:  ""
        });
    }
    submitSelection = () =>{
        this.setState({
            selectedValue: [...this.state.tempSelectedValues],
            showDropDown: false,
            value:this.state.tempSelectedValues ? this.state.tempSelectedValues.toString() : "",
        })
    }

    filterVal = (event)=> {
        let searchedVal = event.target.value;
        let dataArr = this.state.dataArr;
        if(searchedVal){
            let filterArr = [];
            for(let index = 0;index < dataArr.length;index++){
                let displayVal = dataArr[index][this.props.displayKey] || dataArr[index];
                if(displayVal.indexOf(searchedVal) > -1){
                    filterArr.push(dataArr[index]);
                }
            }
            this.setState({
                dataArr : filterArr,
                value: searchedVal
            })
        }else{
            this.setState({
                dataArr : [...dataArr]
            })
        }
        
    }
    render(){
        let dataArr = this.state.dataArr;
        let displayKey = this.props.displayKey;
        let searchable = this.props.searchable || false;
        let multiSelect = this.props.multiSelect || false;
        return (
            <div className="search-drop-down">
                <input 
                    value={this.state.value} 
                    className="input-auto-suggest"
                    onChange= {(event)=>{
                        console.log("filter val called")
                        this.filterVal(event)
                    }}
                    onFocus={()=>{
                        //open drop down
                        this.openCloseDropDown('open')
                    }}
                    readOnly={!searchable}
                />
                <div className={`auto-suggest ${this.state.showDropDown ? 'show' : ''}`}>   
                    <ul className={`auto-suggest-ul`}>
                        {
                            dataArr.map((ele,index)=>{
                                let displayVal = ele[displayKey] || ele;
                                return (
                                    <label htmlFor={"item"+index} onClick={
                                        ()=>{
                                            this.onSelectLi(displayVal);
                                        }
                                    } key={index} style={{cursor: 'pointer'}}>
                                        <li className="list-item" >
                                         {multiSelect ? (
                                            <input type="checkbox" name={"item"+index} 
                                                checked={this.state.tempSelectedValues.indexOf(displayVal) > -1} 
                                                onClick={(event)=>{
                                                    event.stopPropagation();
                                                }}
                                                onChange={
                                                    (event)=> {
                                                        this.onChangeCheckBox(event,displayVal)
                                                    }
                                                }
                                                 
                                            ></input>) : null
                                            }
                                            <span>{displayVal}</span>
                                        </li>
                                    </label>
                                )
                            })
                        }
                    </ul>
                    {
                        multiSelect ? (
                            <div className={`footer-btn-sec`}>
                                <div className="clear-btn btn" onClick={
                                    ()=>{
                                        this.clearSelection();
                                    }
                                }>Clear</div>
                                <div className="btn" onClick={()=>{
                                    this.submitSelection();
                                }}>Submit</div>
                            </div>
                        ) : null
                    }
                </div>
                
            </div>
        )
    }
}
export default SearchDropDown;