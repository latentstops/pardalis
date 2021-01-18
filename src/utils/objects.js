import deepAssign from 'assign-deep';

const deepDiff = require( 'deep-diff' ).diff;
const deepCopy = require( 'deepcopy' );

export { deepAssign }
export { deepDiff }
export { deepCopy }

export function diff2(){
    var origin = cardGame.chip.mesh;
    var clone = origin.clone();
    var originEntries = Object.entries(origin);
    var diff = originEntries.filter( ([key,val]) => clone[key] !== val ).map( ([key,val]) => ({ key, origin: origin[key], clone: clone[key] }) );
}

export function getProp(obj,prop){
    return prop.split('.').reduce( (acc, prop) => acc[prop], obj );
}
export function getJSONDiff( obj ){
    const compare = getDiffSelfBabylon( obj );
    return () => {
        const result = compare();
        const resultJSON = JSON.stringify( result, null, 2 );
        return resultJSON;
    };
}

export function getDiffSelfBabylon( obj ){
    const compareWithSelf = getDiffSelf( obj );
    return () => {
        const diff = compareWithSelf();
        const publicEntries = Object.entries( diff ).filter( ( [ key, val ] ) => {
            return val !== "function" && key.indexOf( "_" ) !== 0;
        } );

        return Object.fromEntries( publicEntries );
    }
}

export function getDiffSelf( obj ){

    const compare = getDiff( obj );

    return () => compare( obj );

}

export function getDiff( obj1 ){

    const callback = deepDiff;

    const compare = processCopies( obj1, callback );

    return obj2 => compare( obj2 );

}

export function processCopies( obj1, callback ){

    const compare = getCopies( obj1 );

    return obj2 => {

        const { state1, state2 } = compare( obj2 );

        return callback( state1, state2 );
    }

}

export function getCopies( obj1 ){

    const state1 = deepCopy( obj1 );

    return function( obj2 ){

        const state2 = deepCopy( obj2 );

        return { state1, state2 };
    }
}

export function getChangedProps( obj1, obj2 ){
    const obj1Entries = Object.entries( obj1 );
    const diff = obj1Entries.filter( ( [ key, val ] ) => obj2[ key ] !== val );
    return diff;
}

export function copyObject( obj ){
    return Object.keys( obj ).reduce( ( acc, key ) => ( acc[ key ] = obj[ key ], acc ), {} );
}

export function joinWithSlash(){
    return join( Array.apply( null, arguments ), '/' );
}

export function join( paths, separator = '/' ){
    return paths.join( separator );
}