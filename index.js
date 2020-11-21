const { Plugin } = require('powercord/entities');
const { React, getModule } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const Connection = require('./components/ConnectAccountButton');
const ConnectionManager = require('./connections');

module.exports = class BetterConnections extends Plugin {
  async startPlugin () {
    this.loadStylesheet('style.scss');

    this.classes = {
      ...await getModule([ 'headerInfo', 'nameTag' ]),
      ...await getModule([ 'modal', 'inner' ]),
      ...await getModule([ 'connection', 'integration' ])
    };
    this.injectSettings();
    this.manager = new ConnectionManager();
    this.manager.start();
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
