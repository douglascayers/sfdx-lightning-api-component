/*
Author: Doug Ayers
Website: https://douglascayers.com
GitHub: https://github.com/douglascayers/sfdx-lightning-api
License: BSD 3-Clause License
 */
public with sharing class LC_APIController {

    @AuraEnabled
    public static String getVisualforceDomainURL() {
        PageReference vfPage = Page.LC_VisualforceDomainPage;
        return ( Test.isRunningTest() ? 'https://visualforce.com' : vfPage.getContent().toString().trim() );
    }

}