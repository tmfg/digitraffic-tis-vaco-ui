###### Digitraffic / Travel Information Services

# Validator-Conversion Queue Handler UI

## App stack

- React
- TypeScript
- Vite

## Required local dependencies

- NodeJS (aiming for latest version)
- npm
- nvm (optional)
- Fintraffic Design System repositories

## Local development 

Install dependencies:
```
npm install
```

Get Fintraffic Design System web components (temporary solution):
```
git clone git@github.com:fintraffic-design/coreui-components.git
git clone git@github.com:fintraffic-design/coreui-css.git
```

In the cloned coreui-components and coreui-css directories:
```
nvm use <node version same as digitraffic-tis-vaco-ui>
npm i
npm link
```

If any need to double-check links were generated correctly:
```
npm -g ls
cd .nvm/versions/<node version>/lib/node_modules
```

Back in digitraffic-tis-vaco-ui:
```
npm link @fintraffic-design/coreui-components
npm link @fintraffic-design/coreui-css
```

Start local dev server:
```
npm run dev
```

---

Copyright Fintraffic 2023. Licensed under the EUPL-1.2 or later.

[gtfs]: https://gtfs.org/
[netex-nordic]: https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/728891481/Nordic+NeTEx+Profile
