import React from 'react';
import { Form } from 'react-bootstrap';

/**
|--------------------------------------------------
| 
|--------------------------------------------------
*/
export default ( props = {} ) => {
//function Input( props = {} ) {

    /**
    |--------------------------------------------------
    | Redux store states
    |--------------------------------------------------
    */

    /**
    |--------------------------------------------------
    | Local refs
    |--------------------------------------------------
    */

    /**
    |--------------------------------------------------
    | Local states
    |--------------------------------------------------
    */

    /**
    |--------------------------------------------------
    | Effects
    |--------------------------------------------------
    */
    React.useEffect( () => {
        console.log( 'debugging input' );
    }, [] );

    /**
    |--------------------------------------------------
    | Local functions
    |--------------------------------------------------
    */

    /**
    |--------------------------------------------------
    | Attributes
    |--------------------------------------------------
    */

    /**
    |--------------------------------------------------
    | Render
    |--------------------------------------------------
    */

    return(
        <div>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>

                <Form.Control type="email" placeholder="Enter email" />

                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>
        </div>
    );
}