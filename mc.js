powercord.api.connections.registerConnection({
    type: 'minecraft',
    name: 'Minecraft',
    color: '#70B237',
    _bc: true,
    icon: {
      color: `${this.baseUrl}/minecraft.svg`,
      white: `${this.baseUrl}/minecraft.svg`
    },
    enabled: true,
    fetchAccount: async (id) =>
    /*
     * let accounts = [];
     * try {
     *   if (!id) {
     *     if (powercord.account) {
     *       accounts = await get(`${this.baseUrl}/api/v2/users/@me/accounts`)
     *         .set('Authorization', powercord.account.token)
     *         .then(r => r.body);
     *     }
     *   } else {
     *     accounts = await get(`${this.baseUrl}/api/v2/users/${id}/accounts`)
     *       .then(r => r.body);
     *   }
     * } catch (e) {
     *   // Let it fail silently
     * }
     */

      // return accounts.find(account => account.type === 'github');
      ({
        id: 'aagaming00',
        name: 'AAGaming00',
        type: 'minecraft',
        verified: true
      }),
    getPlatformUserUrl: (account) => {
      const username = account.id;
      return `https://github.com/${encodeURIComponent(username)}`;
    },
    onDisconnect: async (account) => {}, // del(`${this.baseUrl}/api/v2/users/@me/accounts/${account.type}`)
    onConnect: async () => {
        
    }