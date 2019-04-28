# Call REST API from Lightning Components without Named Credentials

A simple [promise-based](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/js_promises.htm)
[service component](https://developer.salesforce.com/blogs/2018/08/implement-and-use-lightning-service-components.html)
for working with Salesforce REST API and JavaScript Fetch API
directly from your component's JavaScript without you needing to
write Apex or configure Named Credentials. Just install and use.


# Getting Started

1. Deploy this project to your org (you only need what's in `force-app` folder).

2. Explore the `LC_RequestDemo` and `LC_FetchDemo` components in the `force-demo` folder on usage.

3. Try out a demo

    a. Assign yourself the **LC Demo** permission set.

    b. Navigate to the **LC Demo** tab.

    c. Play with the sample components to send different [REST API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/intro_what_is_rest_api.htm) and [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests.

    d. Marvel that you didn't have to write any Apex code or configure a Named Credential :)


## Example Usage

Add the `<c:lc_api>` to your component and give it an `aura:id` for reference.

```xml
<!-- YourComponent.cmp -->
<aura:component>
    <c:lc_api aura:id="lc_api"/>
    ...
</aura:component>
```

Find the `<c:lc_api>` by its `aura:id` then call one of the request methods:
  * The `restRequest(..)` method passing in a JSON object with the `url`, `method`, `body`, and any `headers` properties, or
  * The `fetchRequest(..)` method passing in a JSON object with the `url` and `options` properties 

```js
// YourComponentController.js
({
    createAccount: function( component, event, helper ) {

        component.find( 'lc_api' ).restRequest({
            'url' : '/services/data/v45.0/sobjects/Account',
            'method' : 'post',
            'body' : JSON.stringify({
                "Name" : "LC Demo Account"
            })
        }).then( $A.getCallback( function( response ) {
            // handle response
            // { id: "001f400000YEZB8AAP", success: true, errors: [] }
        })).catch( $A.getCallback( function( err ) {
            // handle error
        }));

    }
})
```

# Troubleshooting

## "Access Denied" or "No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'https://yourinstance.visualforce.com' is therefore not allowed access."

Your request was blocked due to [Cross-Origin Resource Sharing (CORS) policy](https://help.salesforce.com/articleView?id=extend_code_cors.htm&type=5).

This can happen when trying to make a request to `/services/apexrest/` endpoint.
For example, the Visualforce domain hosting `LC_APIPage` is on `https://yourinstance.visualforce.com` and is trying to make a web request to `https://yourinstance.my.salesforce.com/services/apexrest/`.
Because the two domains do not match, then CORS policy prevents the request.

1. In **Setup**, navigate to **Security | CORS**.

2. Add the origin URL mentioned in your error message (e.g. `https://yourinstance.visualforce.com`) to the list of whitelisted domains.


# Credits

[Doug Ayers](https://douglascayers.com) develops and maintains the project.

[Penpal](https://github.com/Aaronius/penpal)
for a secure, promise-based library for communicating between windows and iframes.

[jsforce](https://jsforce.github.io/)
for an elegant, promise-based library for working with Salesforce REST API.


# Other Utilities

You should check out [sfdc-lax](https://github.com/ruslan-kurchenko/sfdc-lax) by Ruslan Kurchenko,
a promise-based service component that makes calling Apex actions or using Lightning Data Service a breeze.


# License

The source code is licensed under the [BSD 3-Clause License](LICENSE)