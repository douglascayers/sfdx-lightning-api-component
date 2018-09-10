# Call REST API from Lightning Components without Named Credentials

A simple [promise-based](https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/js_promises.htm)
[service component](https://developer.salesforce.com/blogs/2018/08/implement-and-use-lightning-service-components.html)
for working with Salesforce REST API
directly from your component's JavaScript without you needing to
write Apex or configure Named Credentials. Just install and use.


# Getting Started

1. Deploy this project to your org (you only need what's in `force-app` folder).

2. Explore the `LC_Demo` component in the `force-demo` folder on usage.

3. Try out a demo

    a. Assign yourself the **LC Demo** permission set.

    b. Navigate to the **LC Demo** tab.

    c. Play with the sample components to send different REST API requests.

    d. Marvel that you didn't have to write any Apex code or configure a Named Credential :)


## Example Usage

Add the `<c:lc_api>` to your component and give it an `aura:id` for reference.

```xml
<!-- YourComponent.cmp -->
<aura:component>
    <c:lc_api aura:id="restClient"/>
    ...
</aura:component>
```

Find the `<c:lc_api>` by its `aura:id` then call the `restRequest(..)` method passing in the `url`, `method`, `body`, and any `headers`.

```js
// YourComponentController.js
({
    createAccount: function( component, event, helper ) {

        component.find( 'restClient' ).restRequest({
            'url' : '/services/data/v43.0/sobjects/Account',
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

# Credits

[Doug Ayers](https://douglascayers.com) develops and maintains the project.

[Postmate](https://github.com/dollarshaveclub/postmate)
for a secure, promise-based library for communicating between windows and iframes.

[jsforce](https://jsforce.github.io/)
for an elegant, promise-based library for working with Salesforce REST API.


# Other Utilities

You should check out [sfdc-lax](https://github.com/ruslan-kurchenko/sfdc-lax) by Ruslan Kurchenko,
a promise-based service component that makes calling Apex actions or using Lightning Data Service a breeze.


# License

The source code is licensed under the [BSD 3-Clause License](LICENSE)