# Utilities for Arrow Connectors

Utilities for helping you build [Arrow Connectors](http://docs.appcelerator.com/platform/latest/#!/guide/Arrow_Connectors).

# Overview

Arrow Connectors transform data structures from third party services and databases into the data model used in Arrow.

This project offers some reusable utilitites across the connector projects. It has some real value in use cases related with dynamic service discovery.

The project defines object schemas for metadata needed to create Arrow Models. Passing proper metadata guarantees the proper generation of models and endpoints by Arrow Framework. The object schemas are specified in the form of [Joi](https://github.com/hapijs/joi) object descriptions.

# How to use it?

1. Install the module

> npm i appc-connector-utils

2. Require it in your project passing the connector and options as context

```javascript
const utils = require('appc-connector-utils')(connector, options)
```

# How to run the test suite?

Run `npm i` and `npm test` in the root of this project.

# Licensing

This software is licensed under the Apache 2 Public License. However, usage of the software to access the Appcelerator Platform is governed by the Appcelerator Enterprise Software License Agreement. Copyright (c) 2014-2017 by Appcelerator, Inc. All Rights Reserved.