# Optimize & Deploy Webflow
Optimize a Webflow exported site & deploy it to Firebase hosting.

## Usage
Install node modules with yarn:
```
$ yarn
```

Optimized the exported Webflow archive:
```
$ INPUT=./export.zip \
 OUTPUT=./build \
 yarn start
```

Deploy to Firebase hosting:
```
$ firebase init && firebase deploy
```
