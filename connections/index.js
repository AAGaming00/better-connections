const { getModule } = require('powercord/webpack');
const { get } = require('powercord/http');

module.exports = class ConnectionManager {
  constructor () {
    // api base
    this.baseUrl = 'https://better-connections.vercel.app';

    // utility functions
    this.cachedGet = window._.memoize((url) => get(url).then(r => r.body), url => {
      setTimeout(() => {
        this.cachedGet.cache.delete(url);
      }, 60e3);
      return url;
    });

    this.connections = [];
  }

  start () {
    require('fs')
      .readdirSync(__dirname)
      .filter(file => file !== 'index.js')
      .map(filename => this.connections.push(require(`${__dirname}/${filename}`)(this)));
  }

  stop () {
    this.connections.forEach(connection => powercord.api.connections.unregisterConnection(connection));
  }

  get getCurrentUser () {
    return getModule([ 'getCurrentUser' ], false).getCurrentUser;
  }
};
