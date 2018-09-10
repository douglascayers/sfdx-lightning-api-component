/*
Author: Doug Ayers
Website: https://douglascayers.com
GitHub: https://github.com/douglascayers/sfdx-lightning-api
License: BSD 3-Clause License
 */
({
    onSubmitRequestConfirmed: function( component, event, helper ) {

        component.set( 'v.responseText', 'please wait...' );

        component.find( 'restClient' ).restRequest({
            'url' : component.get( 'v.url' ),
            'method' : component.get( 'v.httpMethod' ),
            'body' : component.get( 'v.requestBody' ),
            'headers' : component.get( 'v.requestHeaders' )
        }).then( $A.getCallback( function( response ) {
            component.set( 'v.responseIsError', false );
            component.set( 'v.responseText', JSON.stringify( response, null, 2 ) );
        })).catch( $A.getCallback( function( err ) {
            component.set( 'v.responseIsError', true );
            component.set( 'v.responseText', JSON.stringify( err, null, 2 ) );
        }));

    }
})