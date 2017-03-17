# Utilities for Arrow Connectors

Utilities for helping you build [Arrow Connectors](http://docs.appcelerator.com/platform/latest/#!/guide/Arrow_Connectors).

**NOTE: Please use fixed version of this modules until it reaches 1.0.0 due to expected breaking changes in the interface.**

# Overview

Arrow Connectors transform data structures from third party services and databases into the data model used in Arrow. This project offers reusable utilitites across the connector projects. 

## Utilities List

Among the utilities are:

* **Standartization of dynamic Arrow components generation:** The project defines object schemas for metadata needed to create Arrow Models (and other types of components eventually). Passing proper metadata guarantees the proper generation of models and endpoints by Arrow Framework. The object schemas are specified in the form of [Joi](https://github.com/hapijs/joi) object descriptions.

* **Test Utilites:** Clean lifecycle how to get static and dynamic connectors as well as arrow in plain and http mode in your test suites.

* **Extras:** Random extras like model namespacing, parent model name finder etc.

# How to use it?

Install the module

> npm i appc-connector-utils

Since this modules is supposed to work in the context of Arrow Application it must be configured with the following context:

* the Arrow library

* the connector name or instance

Once configured the resulting API could be used according to the project needs.


# How to run the test suite?

Run `npm i` and `npm test` in the root of this project.

# Licensing

This software is licensed under the Apache 2 Public License. However, usage of the software to access the Appcelerator Platform is governed by the Appcelerator Enterprise Software License Agreement. Copyright (c) 2014-2017 by Appcelerator, Inc. All Rights Reserved.