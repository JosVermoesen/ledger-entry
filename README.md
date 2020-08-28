# Ledger Entry

## Getting started for developers

- [Install NodeJS](https://nodejs.org/). Hint: eventually install and use [nvm](https://medium.com/@Joachim8675309/installing-node-js-with-nvm-4dc469c977d9) for easy installing and/or switching between node versions
- Clone this repository: `git clone https://github.com/JosVermoesen/ledgerentry.git`.
- Run `npm install` inside the project root.
- Run `ng serve` in a terminal from the project root.
- Profit. :tada:

## Development Tools used for app

- [NodeJS](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [Angular CLI](https://www.npmjs.com/package/@angular/cli): `npm i -g @angular/cli`

## NPM packages used for this app

- [bootstrap](https://www.npmjs.com/package/bootstrap): `npm i bootstrap`
- [ngx-bootstrap](https://www.npmjs.com/package/ngx-bootstrap): `npm i ngx-bootstrap` (or greater)

## styles.scss

For use of primeNG, Icons and Flex, add into your global styles.scss:

```bash
@import '~bootstrap/dist/css/bootstrap.min.css';
@import '~font-awesome/css/font-awesome.min.css';
@import '~ngx-bootstrap//datepicker//bs-datepicker.css';
```

## Best practices: use lazy loading modules

- Generate modules ex. an a home module: `ng generate module pages/home --route home --module app.module`
- Generate modules ex. a contact module: `ng generate module pages/contact --route contact --module app.module`

## Updating Angular 10

This app is on Angular 10.
Before starting an update to a later version, you always have to commit first

updating within latest Angular 10:
`ng update @angular/cli@10 @angular/core@10`

Follow the instructions eventualy for fixes
