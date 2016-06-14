# hapi-newrelic

Hapi plugin that allows to define custom transaction names for routes in New Relic.

Active maintainer: [ruben.norte@softonic.com](mailto:ruben.norte@softonic.com?subject=hapi-newrelic)

## Installation

```bash
npm install hapi-newrelic
```

## Usage

```js
// CommonJS
// const HapiNewRelic = require('hapi-newrelic');

// ES6
import HapiNewRelic from 'hapi-newrelic';
import newrelic from 'newrelic';

// Registration
server.register({
  register: HapiNewRelic,
  options: { newrelic }
}, err => {});

// Route
server.route({
  method: 'GET',
  path: '/',
  handler: function() {},
  config: {
    plugins: {
      'hapi-newrelic': {
        transactionName: 'root_page'
      }
    }
  }
});
```

## Testing

Clone the repository and execute:

```bash
npm test
```

## Contribute

1. Fork it: `git clone ssh://git@stash.redtonic:7999/NODE/hapi-newrelic.git`
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -am 'Added some feature'`
4. Check the build: `npm run build`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D
