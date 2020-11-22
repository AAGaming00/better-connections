const { Plugin } = require('powercord/entities');
const { React, getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { get } = require('powercord/http');

const Connection = require('./components/ConnectAccountButton');
const ConnectionManager = require('./connections');

const cachedGet = window._.memoize((url) => get(url).then(r => r.body), url => {
  setTimeout(() => {
    cachedGet.cache.delete(url);
  }, 60e3);
  return url;
});

module.exports = class BetterConnections extends Plugin {
  async startPlugin () {
    const { getCurrentUser } = await getModule([ 'getCurrentUser' ]);

    this.classes = {
      ...await getModule([ 'headerInfo', 'nameTag' ]),
      ...await getModule([ 'modal', 'inner' ]),
      ...await getModule([ 'connection', 'integration' ])
    };
    this.injectSettings();
    this.loadStylesheet('style.scss');
    this.manager = new ConnectionManager();
    this.manager.start();
    powercord.api.connections.registerConnection({
      type: 'gitlab',
      name: 'GitLab',
      color: '#FC6D27',
      _bc: true,
      icon: {
        color: `${this.baseUrl}/gitlab-color.svg`,
        white: `${this.baseUrl}/gitlab-white.svg`
      },
      enabled: true,
      fetchAccount: async (id) => {
        let accounts = [];

        try {
          accounts = await cachedGet(`${this.baseUrl}/api/connections/${id || getCurrentUser().id}`);
        } catch (e) {
        // Let it fail silently
        }
        return accounts.gitlab;
      },
      getPlatformUserUrl: (account) => `https://gitlab.com/${encodeURIComponent(account.name)}}`,
      onDisconnect: async (account) => {
        window.open(`${this.baseUrl}/api/link/${account.type}?delete=true`);
      },
      onConnect: async (account) => {
        window.open(`${this.baseUrl}/api/link/${account.type}`);
      }
    });
  }

  async injectSettings () {
    const UserSettingsConnections = await getModule((m) => m.default?.displayName === 'UserSettingsConnections');

    inject('better-connections-settings', UserSettingsConnections, 'default', (args, res) => {
      if (!res.props.children) {
        return res;
      }

      const availableConnections = res.props.children[0].props.children[2].props.children;

      powercord.api.connections.filter((e) => e._bc).forEach((e) => {
        availableConnections.push(React.createElement(Connection, {
          className: this.classes.accountBtn,
          innerClassName: this.classes.accountBtnInner,
          disabled: !e.enabled,
          type: e.type,
          onConnect: e.onConnect,
          key: e.type
        }));
      });

      return res;
    });
    UserSettingsConnections.default.displayName = 'UserSettingsConnections';
  }

  pluginWillUnload () {
    uninject('better-connections-settings');
    this.manager.stop();
  }
};
