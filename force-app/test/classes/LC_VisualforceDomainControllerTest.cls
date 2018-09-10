/*
Author: Doug Ayers
Website: https://douglascayers.com
GitHub: https://github.com/douglascayers/sfdx-lightning-api
License: BSD 3-Clause License
 */
@IsTest
private class LC_VisualforceDomainControllerTest {

    @IsTest
    static void test_get_domain_url() {

        Test.setCurrentPage( Page.LC_VisualforceDomainPage );

        Test.startTest();

        LC_VisualforceDomainController controller = new LC_VisualforceDomainController();

        String domainURL = controller.getDomainURL();

        // The test is not running in Visualforce context,
        // so best we can get here is domain in Apex context.
        System.assertEquals( URL.getSalesforceBaseUrl().toExternalForm(), domainURL );

        Test.stopTest();

    }

}
