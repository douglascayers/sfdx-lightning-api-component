/*
Author: Doug Ayers
Website: https://douglascayers.com
GitHub: https://github.com/douglascayers/sfdx-lightning-api
License: BSD 3-Clause License
 */
({
    onScriptsLoaded: function( component, event, helper ) {
        helper.makeApexRequest( component, 'c.getVisualforceDomainURL', {}, { storable: true } ).then( function( vfDomainURL ) {
            helper.handleOnPostmateScriptsLoaded(
                component,
                component.find( 'postmate' ).getElement(),
                `${vfDomainURL}/apex/LC_APIPage`
            );
        }).catch( $A.getCallback( function( err ) {
            console.error( 'LC_API: Error in script initialization', err );
        }));
    },

    onRestRequest: function( component, event, helper ) {
        var params = event.getParam( 'arguments' );
        return helper.handleRestRequest( component, params.request );
    }
})