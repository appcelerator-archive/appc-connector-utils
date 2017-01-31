# Connector Utilities

Utilities for Arrow Connectors

# Description

## TL;DR

Can be used by all connectors that need to implement GeneratesModels capability (a.k.a. dynamic discovery).

## Overview

Arrow Connectors transform data structures from third party services and databases into the data model used in Arrow. The utilities in this project strive to standartize the transformation in the scenarios that use dynamic service discovery.

The project defines contract for the schema and the model that will guarantee the proper generation of models and endpoints by Arro framework. The contract is specified in the form of [Joi](https://github.com/hapijs/joi) object descriptions.

# How to use it?

The project could be required as npm module or directly from github.

Here is the vision of how this project could be useful for Arrow Connector developer. It is a three steps process:

* Step 1: Write the logic to get the metadata from the third-party service or database. 

* Step 2: Write transformer logic that transforms the metadata to the schema contract defined in this project. 

* Step 3: Having the appropriate transformer one could do:

```javascript
const api = require('appc-connector-utils')(connector);

api.createSchema(yourTransformer, inputData);

api.createModels(options);
```

NOTE: The project is still not available in npm because is work in progress. Furthermore the API works in the context of specific connector.

# What is valid schema?

The valid schema is the one specified in this project via Joi description language. 

The schema contract is something that could evolve over the time and should be made in a way that it is relevant for as much connectors as it is possible.

# How to run the test suite?

Run `npm i` and `npm test` in the root of this project.

Test suite is useful to understand the API exposed by this project.
