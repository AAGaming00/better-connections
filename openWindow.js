const popout = require('./Window');

module.exports = async function (url) {
  const win = await popout(url, 'Link Account', 'DISCORD_BETTER_CONNECTIONS_LINK');
//   const interval = setInterval(() => {
//     try {
//       win.location.href;
//     } catch {
//       clearInterval(interval);
//       setTimeout(() => {
//         win.close();
//       }, 100);
//     }
//   }, 50);
  return win;
};
