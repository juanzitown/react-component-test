import React from 'react';
import { Form } from 'react-bootstrap';

/**
|--------------------------------------------------
| 
|--------------------------------------------------
*/
export default ( props = {} ) => {
//function Autocomplete( props = {} ) {
    
    /**
    |--------------------------------------------------
    | Styles
    |--------------------------------------------------
    */
    
    /**
    |--------------------------------------------------
    | Local refs
    |--------------------------------------------------
    */
    const internalContainerRef = React.useRef();
    const internalInputRef = React.useRef();
    const internalDropdownRef = React.useRef();
    
    /**
    |--------------------------------------------------
    | Local states
    |--------------------------------------------------
    */

    //configs
    const variant = props.variant || 'primary';
    const textVariant = ( variant === 'warning' || variant === 'danger' || variant === 'success' || variant === 'dark' ) ? 'text-white' : 'text-black';
    const className = 'col-sm ' + ( props.className || '' );
    const optionClassName = 'col-sm ';
    const activeOptionClassName = optionClassName + ( 'bg-' + variant ) + ' ' + textVariant;
    const tabIndex= props.tabIndex || '0';
    const type = props.type || 'text';
    const autoFocus = props.autoFocus || false;

    //events
    const onDisplay = props.onDisplay || ( ( value ) => value );
    const onFilter = props.onFilter || ( ( item, value ) => onDisplay( item ).startsWith( value ) );
    const onTemplate = props.onTemplate || ( ( value ) => onDisplay( value ) );
    const onChange = props.onChange || ( () => {} );
	const onFocus = props.onFocus || ( () => {} );
    const onBlur = props.onBlur || ( () => {} );

    //attributes
    const label = props.label || '';
    const placeholder = props.placeholder || '';
    const options = props.options || [];
    const [filtered, setFiltered] = React.useState( options );
    const [value, setValue] = React.useState( props.value );
    const [display, setDisplay] = React.useState( value ? onDisplay( value ) : '' );
    const [activeIndex, setActiveIndex] = React.useState( 0 );
    const [showOptions, setShowOptions] = React.useState( false );

    //validations
	const required = props.required || false ;
    const invalid = props.invalid || ( () => false );
    
    //messages
    const [emptyMessage, setEmptyMessage] = React.useState( props.emptyMessage || 'Nenhum registro encontrado' );
	const [requiredMessage, setRequiredMessage] = React.useState( props.requiredMessage || 'Seleção obrigatória' );
    const [invalidMessage, setInvalidMessage] = React.useState( props.invalidMessage || 'Seleção inválido' );
    const [invalidFeedback, setInvalidFeedback] = React.useState( '' );
    const feedback = props.feedback || '';

    //dom
    const [offsetWidth, setOffsetWidth] = React.useState( 0 );

    //dom event listeners
    const mouseDownEventListener = ( e ) => {
        if( internalInputRef.current && internalInputRef.current.contains( e.target ) ) return;
        else if( internalDropdownRef.current && internalDropdownRef.current.contains( e.target ) ) return;
        setShowOptions( false );
    };
    
    /**
    |--------------------------------------------------
    | Effects
    |--------------------------------------------------
    */

    //dom event listener control
    React.useEffect( () => {
        document.addEventListener( "mousedown", mouseDownEventListener );
        return () => document.removeEventListener( "mousedown", mouseDownEventListener ); // return function to be called when unmounted
    }, [] );

    //dropdown current active item control
    React.useEffect( () => {
        if( activeIndex > filtered.length - 1 ) setActiveIndex( 0 );
        if( activeIndex < 0 ) setActiveIndex( filtered.length - 1 );
    }, [activeIndex] );

    //validation message control
    React.useEffect( () => {
        const invalidated = ( required && !value ) || invalid( value );
        internalInputRef.current.setCustomValidity( invalidated ? 'invalid' : '' );
        setInvalidFeedback( required && !value ? requiredMessage : invalid( value ) ? invalidMessage : '' );
    }, [value] );
    
    /**
    |--------------------------------------------------
    | Local functions
    |--------------------------------------------------
    */

    function _onSelectChange( newValue ) {
        const newDisplay = onDisplay( newValue );
        setValue( newValue );
        setDisplay( newDisplay );
        setFiltered( options.filter( option => onFilter( option, newDisplay ) ) );
        setActiveIndex( 0 );

        internalInputRef.current.focus();
        setShowOptions( false );
    }

    function _onBlur( event ) {
        onBlur( event );
    }

    function _onFocus( event ) {
        if( internalInputRef.current ) setOffsetWidth( internalInputRef.current.offsetWidth );
        if( filtered.length !== 1 || display !== onDisplay( filtered[0] ) ) setShowOptions( true );
        onFocus( event );
    }

    function _onChange( event ) {
        const newDisplay = event.target.value.toLowerCase().trimLeft();
        const newFiltered = options.filter( option => onFilter( option, newDisplay ) );
        setValue( null );
        setDisplay( newDisplay );
        setFiltered( newFiltered );
        setShowOptions( true );

        if( newFiltered.length === 1 && newDisplay === onDisplay( newFiltered[0] ) ) _onSelectChange( newFiltered[0] );
    }

    function _onKeyDown( event ) {
        switch( event.keyCode ) {
            case 13:
                event.stopPropagation();
                event.preventDefault();
                _onSelectChange( filtered[activeIndex] );
                break;
            
            case 38:
                setActiveIndex( activeIndex - 1 );
                break;
            
            case 40:
                setActiveIndex( activeIndex + 1 );
                break;
            
            default:
                break;
        }
    }
    
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
        <Form.Group ref={ internalContainerRef } className={ className } style={{ position: 'relative' }}>
            { label ? <Form.Label>{ label }</Form.Label> : null }

            <Form.Control
                type={ type }
                tabIndex={ tabIndex }
                autoFocus={ autoFocus }
                ref={ internalInputRef }
                
                placeholder={ placeholder }
                value={ display }
                
                onBlur={ ( event ) => _onBlur( event ) }
                onFocus={ ( event ) => _onFocus( event ) }
                onKeyDown={ ( event ) => _onKeyDown( event ) }
                onChange={ ( event ) => _onChange( event ) } />
                
            <Form.Control.Feedback type="invalid">{ invalidFeedback }</Form.Control.Feedback>
            { feedback ? <Form.Text className="text-muted">{ feedback }</Form.Text> : null }
            
            { showOptions ? 
                <div ref={ internalDropdownRef } style={{ position: 'absolute', width: offsetWidth, zIndex: '2', border: '1px solid #e0e0e0', background: '#eee' }}>
                    { filtered.length ? 
                        filtered.map( ( option, index ) => <div key={ index } className={ index === activeIndex ? activeOptionClassName : optionClassName } onMouseEnter={ () => setActiveIndex( index ) } onMouseUp={ () => _onSelectChange( filtered[index] ) }>{ onTemplate( option ) }</div> ) : 
                        <span className="col text-black-50">{ emptyMessage }</span> }
                </div> : null }
        </Form.Group>
    );
}