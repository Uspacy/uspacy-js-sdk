## Install

```sh
npm install --save @uspacy/sdk
```

## Example

```javascript
import Uspacy from '@uspacy/sdk';

const uspacyClient = Uspacy.createInstance();

uspacyClient.authService.login({ email: 'email@gmail.com', password: '12345678' });
```
