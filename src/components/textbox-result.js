import React from 'react';

export const TextBoxResult = ({record})=>{
    if(record){
        return (
            <div className="text-center">
                <h3>JSON Output</h3>
                <textarea rows="20" cols="80" defaultValue={record}></textarea>
            </div>
        );
    }
}