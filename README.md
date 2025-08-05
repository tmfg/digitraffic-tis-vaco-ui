###### Digitraffic / Travel Information Services

# Validator-Conversion UI

## App stack

- React
- TypeScript
- Vite

## Usage

## Development

### Prerequisites

> See [Development Environment Setup](https://finrail.atlassian.net/wiki/spaces/VACO1/pages/2720825453/Development+Environment+Setup)
> on Confluence for initial common setup instructions.

- NodeJS (v22+)
- npm
- nvm (optional)
- Fintraffic Design System repositories

## Local Development

> **Note!** The shell commands below assume you start from current directory and run them as-is in sequence.

### Setup Fintraffic Design System repositories
 
Get Fintraffic Design System web components:
```shell
cd ..
git clone git@github.com:fintraffic-design/coreui-components.git
git clone git@github.com:fintraffic-design/coreui-css.git
```

In the cloned `coreui-components` (important: node version should be set the same as digitraffic-tis-vaco-ui):
```shell
cd coreui-components
nvm use v22
npm install
npm link
```

In the cloned `coreui-css`:
```shell
cd ../coreui-css
nvm use v22
npm install
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
npm install
```

### Running Local Development Server

```shell
npm run dev
```
This will make the UI available in [http://localhost:5173/ui](http://localhost:5173/ui)

---

Copyright Fintraffic 2023-2025. Licensed under the EUPL-1.2 or later.

[gtfs]: https://gtfs.org/
[netex-nordic]: https://enturas.atlassian.net/wiki/spaces/PUBLIC/pages/728891481/Nordic+NeTEx+Profile
