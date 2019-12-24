/* eslint-disable @lwc/lwc/no-async-operation */
import { LightningElement, wire, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import PP from '@salesforce/resourceUrl/penpal'
import getVisualforceDomainURL from '@salesforce/apex/LC_VisualforceDomainController.getVisualforceDomainURL';

export default class LwcApi extends LightningElement {

    _penpal = {};
    penpalInitialized = false;
    iframeSrc = '';

    @wire(getVisualforceDomainURL) wiredDomainUrl({ error, data }) {
        if (data) {
            this.iframeSrc = data + '/apex/LC_APIPage';
            this.initializePenpal();
        } else if (error) {
            console.error('LWC_API: error getting Visualforce Domain URL', error);
            this.iframeSrc = undefined;
        }
    }

    connectedCallback() {
        Promise.all([
            loadScript(this, PP)
        ]).then(() => { });
    }

    initializePenpal() {

        let initialized = this.penpalInitialized;
        var self = this;

        // Since the iframe source is calculated asynchronously,
        // we listen to the component's render events and each time
        // check if the iframe is ready, and if so, then we initialize
        // penpal to connect this component to the iframe.
        // Since we only want to do this once, we also set the initialized flag.
        if (!initialized) {

            const container = this.template.querySelector('div');
            const iframeElmt = document.createElement('iframe');
            iframeElmt.src = this.iframeSrc;
            container.appendChild(iframeElmt);

            if (iframeElmt != null) {

                this.penpalInitialized = true;

                // eslint-disable-next-line no-undef
                const connection = Penpal.connectToChild({
                    // The iframe to which a connection should be made
                    iframe: iframeElmt
                });

                this._penpal.connection = connection;

                connection.promise.then(function (child) {
                    // Cache a reference to the child so that we can
                    // use it in the restRequest/fetchRequest methods,
                    // as well as be able to destroy it when this component unrenders.
                    self._penpal.child = child;
                }).catch(function (err) {
                    console.error('LWC_API: Error establishing connection to iframe', err);
                    self.penpalInitialized = false;
                });

            } // else, iframe source is empty, keep waiting
        }
    }

    // Makes a Salesforce REST API request and returns a promise that resolves to the response.

    // @param request
    // JSON object with properties:
    // 'url'(String, required) The Salesforce REST endpoint to call.
    //             'method'(String, optional) The http method like 'get' or 'post'.Default is 'get'.
    //             'body'(String, optional) The request body, varies by the endpoint you're calling.
    //             'headers'(Map, optional)    String key - value pairs of http headers to send.
    //             Default is { 'Content-Type' : 'application/json' }.
    //             Your headers are merged with the default headers,
    //                 overwriting any existing keys.

    // Example usage:
    // component.find('lcAPI').restRequest({
    //     'url': '/services/data/v45.0/sobjects/Account',
    //     'method': 'post',
    //     'body': JSON.stringify({
    //         'Name': 'Salesforce',
    //         'BillingStreet': '1 Market Street',
    //         'BillingCity': 'San Francisco',
    //         'BillingState': 'CA'
    //     }),
    //     'headers': {
    //         'Sforce-Query-Options': 'batchSize=200'
    //     }
    // }).then($A.getCallback(function (response) {
    //     // handle response
    // })).catch($A.getCallback(function (err) {
    //     // handle error
    // }));

    @api restRequest(request) {

        var self = this;
        var defaultRequest = {
            'method': 'get'
        };
        var defaultHeaders = {
            'Content-Type': 'application/json'
        };

        request = Object.assign({}, defaultRequest, request);
        request.headers = Object.assign({}, defaultHeaders, request.headers);

        return this.getPenpalChild().then(function (child) {
            return self.makePenpalRequest('rest', child, request);
        });
    }

    //     Makes a JavaScript Fetch request and returns a promise that resolves to the response.
    //     https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch

    //     @param request
    //     JSON object with properties:
    //     'url'(String, required) The url to fetch.
    //      'options'(Map, optional)    The init options for the request.

    //     Example usage:
    //     component.find('lcAPI').fetchRequest({
    //         'url': 'https://example.com',
    //         'options': {
    //             'method': 'GET',
    //             'headers': {
    //                 'Accepts': 'application/json'
    //             }
    //         }
    //     }).then($A.getCallback(function (response) {
    //         // handle response
    //     })).catch($A.getCallback(function (err) {
    //         // handle error
    //     }));

    @api fetchRequest(request) {
        return this.getPenpalChild().then(function (child) {
            return this.makePenpalRequest('fetch', child, request);
        });
    }

    // ------------------------------------------------------------

    /**
     * For internal use.
     * Returns a promise waiting for the parent-child postmate handshake to complete
     * then resolves with reference to the postmate child for making requests.
     */
    getPenpalChild() {

        var self = this;

        return new Promise(function (resolve, reject) {

            let child = self._penpal.child;

            if (child) {

                resolve(child);

            } else {

                // all time values in milliseconds
                let timeout = 10000; // ten seconds
                let pollFrequency = 500; // half a second
                let startTime = new Date().getTime();
                let endTime = startTime + timeout;

                // all time values in milliseconds
                let timerId = setInterval(function () {

                    child = self._penpal.child;

                    if (child) {

                        // parent-child postmate handshake now complete
                        clearInterval(timerId);
                        resolve(child);

                    } else {

                        // check if we have exceeded our timeout
                        let currentTime = new Date().getTime();
                        if (currentTime > endTime) {
                            clearInterval(timerId);
                            reject('LWC_API: Timeout trying to establish connection to iframe');
                        }
                        // else, keep polling
                    }
                }, pollFrequency);
            }
        });
    }

    /**
     * For internal use.
     * Returns a promise waiting for the parent-child postmate request to complete
     * then resolves with response from the child iframe.
     */
    makePenpalRequest(requestType, child, request) {

        var p;

        if (requestType === 'rest') {
            p = child.restRequest(request);
        } else if (requestType === 'fetch') {
            p = child.fetchRequest(request);
        } else {
            p = Promise.resolve({
                success: false,
                data: 'LWC_API: Invalid request type: ' + requestType
            });
        }

        return p.then(function (response) {

            if (response.success) {
                return response.data;
            }
            throw new Error(response.data);

        });

    }

    disconnectedCallback() {
        // When component unrenders then cleanup penpal
        // resources by destroying the connection and nulling out
        // the helper's cached reference to the connection and child.
        // This ensures that the helper.handleXyzRequest(..) methods
        // wait appropriately for the new parent-child handshake to complete
        // when this component is re-initialized and scripts are loaded.
        if (this._penpal && this._penpal.connection) {
            this._penpal.connection.destroy();
            this._penpal = {};
        }
    }

}
