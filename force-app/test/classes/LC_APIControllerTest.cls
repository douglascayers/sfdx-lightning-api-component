/*
Author: Doug Ayers
Website: https://douglascayers.com
GitHub: https://github.com/douglascayers/sfdx-lightning-api
License: BSD 3-Clause License
 */
@IsTest
private class LC_APIControllerTest {

    @IsTest
    static void test_get_visualforce_domain_url() {

        Test.startTest();

        String vfDomainURL = LC_APIController.getVisualforceDomainURL();

        System.assertEquals( 'https://visualforce.com', vfDomainURL );

        Test.stopTest();

    }

}