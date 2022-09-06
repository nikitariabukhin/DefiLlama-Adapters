const { getUniTVL } = require('../helper/unknownTokens')

module.exports = {
  misrepresentedTokens: true,
  ethereum: {
    tvl: getUniTVL({ chain: 'ethereum', factory: '0x96FF042f8c6757fCE515d171F194b5816CAFEe11', useDefaultCoreAssets: true, }), 
  },
};
