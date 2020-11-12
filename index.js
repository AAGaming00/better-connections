const { Plugin } = require('powercord/entities');
const { React, getModule, getModuleByDisplayName } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { get, del } = require('powercord/http');
const Connection = require('./components/ConnectAccountButton');

module.exports = class BetterConnections extends Plugin {
  constructor () {
    super();

    this.baseUrl = 'https://better-connections.vercel.app';
  }

  async startPlugin () {
    this.loadStylesheet('style.scss');
    const { getCurrentUser } = await getModule([ 'getCurrentUser' ]);
    this.classes = {
      ...await getModule([ 'headerInfo', 'nameTag' ]),
      ...await getModule([ 'modal', 'inner' ]),
      ...await getModule([ 'connection', 'integration' ])
    };
    this.injectSettings();
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
          if (!id) {
            accounts = await get(`${this.baseUrl}/api/connections/${getCurrentUser().id}`).then(r => r.body);
          } else {
            accounts = await get(`${this.baseUrl}/api/connections/${id}`).then(r => r.body);
          }
        } catch (e) {
        // Let it fail silently
        }
        return accounts.gitlab;
      },
      getPlatformUserUrl: (account) => {
        const username = account.name;
        return `https://gitlab.com/${encodeURIComponent(username)}`;
      },
      onDisconnect: async (account) => {
        window.open(`${this.baseUrl}/api/link/${account.type}?delete=true`);
      },
      onConnect: async () => {
        window.open(`${this.baseUrl}/api/link/gitlab`);
      }
    });
  }

  async injectSettings () {
    const UserSettingsConnections = await getModule(m => m.default && m.default.displayName === 'UserSettingsConnections');
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
          onConnect: e.onConnect
        }));
      });

      return res;
    });
    UserSettingsConnections.default.displayName = 'UserSettingsConnections';
  }

  pluginWillUnload () {
    uninject('better-connections-settings');
    powercord.api.connections.unregisterConnection('gitlab');
  }
};
