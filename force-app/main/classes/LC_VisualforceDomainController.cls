/*
Author: Doug Ayers
Website: https://douglascayers.com
GitHub: https://github.com/douglascayers/sfdx-lightning-api
License: BSD 3-Clause License
 */
public with sharing class LC_VisualforceDomainController {

    public String getDomainURL() {
        URL requestURL = URL.getCurrentRequestUrl();
        return requestURL.toExternalForm().substringBefore( requestURL.getPath() );
    }

}
