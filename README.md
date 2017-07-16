Arise
=====

A small library for showing modals and popups, written in React. Compatible with preact and preact-compat. Total download size with gzipping sits just over 1KB. It is intended to be used with a module bundler like webpack.

Package Status
--------------

This is in beta stage right now. As soon as I get the tests up and going I'll promote it to stable, and I'll put the version at 1.0.  

Installation
------------

NPM: `npm install react-arise`

Yarn (suggested): `yarn add react-arise`


Usage
-----

You can set the HTML directly or you can set a child element. It is highly suggested to only set one.

**Example Component (ES6):**
```
import React, Component from 'react';
import Arise from 'react-arise';

class ExampleComponent extends Component {

  render() {
    return <Arise />; // More specific example code below
  }
}
```

**HTML:**
```
<Arise show={ true } html="<p>Hey, I'm a modal!</p>" modal={true} onClose={ closeFunc }/>
```

**Child:**
```
  <input ref="inputElement">
  <Arise show={ false } anchorElement={ this.refs.inputElement } onClose={ closeFunc }>
    <p>Put your text in here, bloke</p>
  </Arise>
```

Attributes
----------
* **show (boolean):** Change whether the popup/modal is shown.
* **html (string):** Sets the innerHTML of the component's inner container. Use this instead of passing children if you like.
* **modal (boolean):** Modal mode. Sets up an overlay and the content on top of that. See the notes section at the end for considerations.
* **modalClasses (object):** Classes for modal mode (not popup). Can contain up to two keys: `container` and `content`, both with string values of what you want the class names to be.
* **popupClass (string):** Class for container in popup mode (not modal)
* **closeOnClick (boolean):** In modal mode, decide whether clicking on the overlay closes the modal. Defaults to `true`.
* **anchorElement (element):** In popup mode, the element that the popup is tied to. At the moment it is only shown below, but that is expected to change in the future.
* **popupPadding (string):** In popup mode, the CSS value for the amount of space given between the `anchorElement` and the container. It has a default of `5px`.
* **onClose (function):** Function that is called when closing. Be sure to change the state for whatever you're using to control the `show` property. 


Notes
-----

The popup/modal containers in the component do not break out of normal component embedding. That means if you embed the component in another that is relatively positioned it may not behave the way you expect. That is, unless you expect the modal to only cover the component that is relatively positioned. If you need a universal modal/popup that appears above everything, you can try using `Arise.universal(props)`. You can pass all the props above along as an object. There may be kinks in using this function as a component, but if there are I plan to make it work.

License
-------

It's MIT, which means you can use it for whatever you want. The only stipulation is that you give proper credit that the end user can see in the delivered asset files which include the code.
