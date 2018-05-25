import React from 'react';
import ReactDOM from 'react-dom';
import UploadForm from './components/upload-form';
import styles from './style.css';

class App extends React.Component {
    render() {
        return (
            <div className="app">
                <UploadForm />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));