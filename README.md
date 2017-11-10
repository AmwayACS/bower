# Bower - A package manager for the web (ACC-SemVer)

## Amway Core Components patched version of Bower

Amway Core Components (ACC) uses automated build process described at https://jira.amway.com:8444/display/AM/Version+Control+and+Deployment+Process. As Bower by default ignores non release candidates, candidates that have -alpha, -beta or -prerelease tags; they would be excluded from
builds in Test and QA environments.
<img align="right" height="300" src="http://bower.io/img/bower-logo.png">

---

Only Amway specific customizations are listed here, please refer to Bower.io for complete documentation.

**View complete docs on [bower.io](http://bower.io)**

[View all packages available through Bower's registry](http://bower.io/search/).

## Pre-Install setup
Bower depends on [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/). Also make sure that [git](http://git-scm.com/) is installed as some bower
packages require it to be fetched and installed.

This version of Bower is available on acc nexus repository and requires additional configuration of NPM before installation

```sh
npm config set registry http://10.75.16.10:8081/repository/npm
```

## Install

Installing customized version of Bower should not cause any issues as it behaves exactly like regular Bower except when it sees `acc-*` environment variables.

```sh
$ npm install -g bower
```



## Usage

See complete command line reference at [bower.io/docs/api/](http://bower.io/docs/api/)

### Installing packages and dependencies (See acc-env info below)

```sh
# install dependencies listed in bower.json
$ bower install

# install a package and add it to bower.json
$ bower install <package> --save

# install specific version of a package and add it to bower.json
$ bower install <package>#<version> --save
```

To uninstall a locally installed package:

```sh
$ bower uninstall <package-name>
```

## Build Environment Configuration

Environment level determines if pre-release versions are considered as candidates while installing a package

```sh
# Setup environment variable ACC_ENV to DV, TS, QA or PD
$ export ACC_ENV=DV
```

* `DV` All pre-release versions are considered [ `alpha`, `beta`, `prerelease` and `stable`]
* `TS` All pre-release versions except `alpha` builds of the package are considered [ `beta`, `prerelease` and `stable`]
* `QA` Only pre-release and stable versions of the package are considered [ `prerelease` and `stable`]
* `Default`/`PD` only stable versions of the package are considered

To ensure that external libraries' unstable builds are not pulled in, package name is matched against a regular expression, if the package doesn’t match the patter; non-release builds are not considered.

```sh
export ACC_BOWER_PATTERN='\^acc-\'
```
Only packages that start with "acc-" are considered

## Configuration

Bower can be configured using JSON in a `.bowerrc` file. Read over available options at [bower.io/docs/config](http://bower.io/docs/config).
Bower configuration is used to make Bower aware of Core Components, configuration information can be found at https://jira.amway.com:8444/display/AM/Bower+Client+Setup



## License

Copyright (c) 2016 Twitter and [other contributors](https://github.com/bower/bower/graphs/contributors)

Licensed under the MIT License

