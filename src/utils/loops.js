export function loop( callback, count, timeoutMs = 0 ){

    if( !count ) return;

    count--;

    setTimeout( () => ( loop( callback, count, callback( count, timeoutMs ) ) ), timeoutMs);

    return timeoutMs;

}