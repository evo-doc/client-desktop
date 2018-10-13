# EvoDoc v2

## Getting Started

### Requirements & Dependencies

- NodeJS `>=8.0.0`
- Yarn `>=1.9.0`

Install dependencies:
```
yarn
```


### Development

An app bundle with source maps, watching files and without css extraction.

```
yarn build:dev
yarn start:dev
```


### Production

A production bundle. All source codes are minified, css files was extracted etc.

```
yarn build:prod
yarn start:prod
```


### Packager

Bundle the whole app into 1 execution file (`.app`, `.exe`, etc.).
```
yarn packager:mac # macOS
yarn packager:lin # linux
yarn packager:win # windows
```


### Clean
Universal clean task:
```
yarn clean
```

Other tasks:
```
yarn clean:build     # clean build folder
yarn clean:release   # clean releases
yarn clean:logs      # clean logs
```


## Code style

[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) + own style defined in `.eslintrc.json`