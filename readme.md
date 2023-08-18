## Install

```sh
yarn add @uspacy/sdk
```

or

```sh
npm install @uspacy/sdk
```

## Example

```javascript
import Uspacy from '@uspacy/sdk';

const uspacyClient = Uspacy.createInstance();

uspacyClient.authService.login({ email: 'email@gmail.com', password: '12345678' });
```

## [Docs](https://uspacy.github.io/js-sdk)
