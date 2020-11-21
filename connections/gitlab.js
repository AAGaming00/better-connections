module.exports = (manager) => {
  powercord.api.connections.registerConnection({
    type: 'gitlab',
    name: 'GitLab',
    color: '#FC6D27',
    _bc: true,
    icon: {
      color: `${manager.baseUrl}/gitlab-color.svg`,
      white: `${manager.baseUrl}/gitlab-white.svg`
    },
    enabled: true,
    fetchAccount: async (id) => {
      let accounts = [];
      try {
        accounts = await manager.cachedGet(`${manager.baseUrl}/api/connections/${id || manager.getCurrentUser().id}`);
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
      window.open(`${manager.baseUrl}/api/link/${account.type}?delete=true`);
    },
    onConnect: async () => {
      window.open(`${manager.baseUrl}/api/link/gitlab`);
    }
  });
  return 'gitlab';
};
