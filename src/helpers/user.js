export function userAvatars(username = '') {
  username = username.toLowerCase();
  return {
    small: `https://a.rsg.sc/n/${username}/s`,
    large: `https://a.rsg.sc/n/${username}/l`
  };
}
