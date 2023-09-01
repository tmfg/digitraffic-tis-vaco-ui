###### Digitraffic / Travel Information Services

# Validator-Conversion Queue Handler UI

## App stack

- React
- TypeScript
- Vite

## Required local dependencies

- NodeJS (v18.17.0)
- npm
- nvm (optional)
- Fintraffic Design System repositories

## Local development

Get Fintraffic Design System web components (temporary solution):
```shell
cd ..
git clone git@github.com:fintraffic-design/coreui-components.git
git clone git@github.com:fintraffic-design/coreui-css.git
```

In the cloned coreui-components (important: node version should be set the same as digitraffic-tis-vaco-ui):
```shell
cd coreui-components
nvm use v18.17.0
npm i
npm link
```

In the cloned coreui-css:
```shell
cd ../coreui-css
nvm use v18.17.0
npm i
npm link
```

If any need to double-check links were generated correctly:
```
npm -g ls
cd .nvm/versions/<node version>/lib/node_modules
```

Back in digitraffic-tis-vaco-ui:
```shell
cd ../digitraffic-tis-vaco-ui
npm link @fintraffic-design/coreui-components
npm link @fintraffic-design/coreui-css
npm i
```

Start local dev server:
```
npm run dev
```

---

Copyright Fintraffic 2023. Licensed under the EUPL-1.2 or later.

[gtfs]: https://gtfs.org/
[netex-nordic]: https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/728891481/Nordic+NeTEx+Profile
