import packageJSON from '../package.json';

/**
 * Hapi plugin to configure New Relic options at route level (transactionName for now).
 *
 * @example
 *
 * import HapiNewRelic from 'hapi-newrelic';
 * import newrelic from 'newrelic';
 *
 * // Registration
 * server.register({
 *   register: HapiNewRelic,
 *   options: { newrelic }
 * }, err => {});
 *
 * // Route
 * server.route({
 *   method: 'GET',
 *   path: '/',
 *   handler: function() {},
 *   config: {
 *     plugins: {
 *       'hapi-newrelic': {
 *         transactionName: 'root_page'
 *       }
 *     }
 *   }
 * });
 *
 * @type {Object}
 */
const HapiNewRelic = {

  /**
   * Registers the plugin in the Hapi server
   * @param  {hapi.Server}        server
   * @param  {Object}             options
   * @param  {Function}           notifyRegistration
   */
  register(server, options, notifyRegistration) {
    const { newrelic } = options;

    server.ext('onPreResponse', (request, reply) => {
      const config = Object.assign(
        {},
        request.route.settings.plugins['hapi-newrelic'],
        request.plugins['hapi-newrelic']
      );
      const transactionName = config && config.transactionName;

      if (transactionName) {
        newrelic.setTransactionName(transactionName);
      }

      reply.continue();
    });

    notifyRegistration();
  }
};

HapiNewRelic.register.attributes = {
  pkg: packageJSON
};

export default HapiNewRelic;
