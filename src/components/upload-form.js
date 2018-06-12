import React, { Component } from 'react';
import { googleSheetsConvertor } from './google-sheets-convertor';
import {TextBoxResult} from './textbox-result'; 

export default class uploadForm extends Component {

    constructor(props){
        super(props);

        this.state = { 'sheeturl': '', 
                        record: null
                    };    
    }

    onInputChange(event) {
        this.setState({'sheeturl': event.target.value});
    }

    onFormSubmit(event) {
        event.preventDefault();
        googleSheetsConvertor(this.state.sheeturl, (record)=>this.setState({record}));
    }

    render(){
        if(!this.state.record){
            return (
                <div className="form-section">
                    <div className="form-element">
                        <h4>Upload an xlsx file</h4>
                        <form className="uploadForm"
                            encType="multipart/form-data"
                            action="upload"
                            method="post"
                        >
                            <input className="btn" type="file" name="file" />
                            <input className="btn" type="submit" value="Upload" name="submit" />
                        </form>
                    </div>
                    <div className="form-element">
                        <h4>Enter url of google sheet</h4>
                        <form className="uploadForm" onSubmit={this.onFormSubmit.bind(this)}>
                            <input placeholder="https://sheets.googleapis.com/..."  className="btn" type="text" onChange={this.onInputChange.bind(this)} />
                            <input className="btn" type="submit" value="Submit" name="submit" />
                        </form>  
                    </div>              
                </div>
            );
        }
        else {
            return (
                <TextBoxResult record={this.state.record} />
            );
        }        
    }
}