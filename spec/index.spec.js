import hapi from 'hapi';
import HapiNewRelic from '../es/index';

describe('HapiNewRelic', () => {
  function createNewRelicStub() {
    return jasmine.createSpyObj('newrelic', ['setTransactionName']);
  }

  function createServerWithPlugin({ onPreResponse, newrelic }) {
    const server = new hapi.Server();
    server.connection();
    server.register({
      register: HapiNewRelic,
      options: {
        newrelic
      }
    });
    server.ext('onPreResponse', onPreResponse, {
      after: 'hapi-newrelic'
    });
    return server;
  }

  function okHandler(request, reply) {
    reply('OK');
  }

  it('should be a Hapi plugin', () => {
    expect(HapiNewRelic.register).toEqual(jasmine.any(Function));
    expect(HapiNewRelic.register.attributes.pkg.name).toBe('hapi-newrelic');
  });

  describe('when it is registered, before sending responses (onPreResponse)', () => {
    describe('AND the route has a configured transaction name for the plugin', () => {
      it('should use it as the transaction name for New Relic', done => {
        const newrelic = createNewRelicStub();

        const onPreResponse = () => {
          expect(newrelic.setTransactionName).toHaveBeenCalledWith('foo-transaction');
          done();
        };

        const server = createServerWithPlugin({ onPreResponse, newrelic });

        server.route({
          method: 'GET',
          path: '/test',
          handler: okHandler,
          config: {
            plugins: {
              'hapi-newrelic': {
                transactionName: 'foo-transaction'
              }
            }
          }
        });

        server.inject({ method: 'GET', url: '/test' });
      });
    });

    describe('AND the route does NOT have a transaction name configured for the plugin', () => {
      describe('AND the request does have a transaction name configured for the plugin',
        () => {
          it('should use it as the transaction name for New Relic', done => {
            const newrelic = createNewRelicStub();

            const onPreResponse = () => {
              expect(newrelic.setTransactionName).toHaveBeenCalledWith('foo-transaction');
              done();
            };

            const server = createServerWithPlugin({ onPreResponse, newrelic });

            server.route({
              method: 'GET',
              path: '/test',
              handler: okHandler
            });

            // eslint-disable-next-line quote-props
            server.inject({
              method: 'GET',
              url: '/test',
              plugins: {
                'hapi-newrelic': {
                  transactionName: 'foo-transaction'
                }
              }
            });
          });
        });

      describe('AND the request does NOT have a transaction name configured for the plugin',
        () => {
          it('should NOT set a transaction name for New Relic', done => {
            const newrelic = createNewRelicStub();

            const onPreResponse = () => {
              expect(newrelic.setTransactionName).not.toHaveBeenCalled();
              done();
            };

            const server = createServerWithPlugin({ onPreResponse, newrelic });

            server.route({
              method: 'GET',
              path: '/test',
              handler: okHandler
            });

            server.inject({ method: 'GET', url: '/test' });
          });
        });
    });
  });
});
