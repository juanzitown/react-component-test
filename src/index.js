import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import { render } from 'react-dom';
import Hello from './Hello';
import Autocomplete from './components/Autocomplete';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';

class App extends Component {
    
    state = {
        name: 'React',
    };

    render() {
        return (
            <div className="p-4">
                <Hello name={this.state.name} />
                <Form noValidate validated={ true }>
                    <Autocomplete onDisplay={ option => option.nome } options={ [{ id: 1, nome: 'one' }, { id: 2, nome: 'two' }, { id: 3, nome: 'three' }, { id: 4, nome: 'four' }] } required invalid={ option => option.id === 1 } />

                    <button type="submit">ok</button>
                </Form>
            </div>
        );
    }
}

render(<App />, document.getElementById('root'));
