# Connector Utilities

Utilities for Arrow Connectors

# Overview

Arrow Connectors transform data structures from third party services and databases into the data model used in Arrow. The utilities in this project strive to standartize the transformation.

Moreover, the project contains descriptions of the schema and model format. The contract is specified in the form of [Joi](https://github.com/hapijs/joi) object descriptions.

# How to use it? 

The project could be required as npm module or directly from github. Then the connector developer could use the following process:

* Write the logic of getting the metadata from the third-party service or database. 

* Write transformer that transforms the metadata to valid schema. 

* Use the utility functions from this module to create Arrow models out of the schema.

# What is valid schema?

The valid schema is the one specified in this project via Joi description language. The schema contract is something that could evolve over the time and should be made in a way that it is relevant for as much connectors as it is possible.


# How to run the test suite

To understand the API exposed by this project one could look at the test suite.