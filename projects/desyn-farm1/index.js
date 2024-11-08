const { getLogs } = require('../helper/cache/getLogs')

module.exports = {
  methodology: 'On-chain restaking',
  doublecounted: true
}

const config = {
  btr: { factory: '0x09eFC8C8F08B810F1F76B0c926D6dCeb37409665', fromBlock: 2393247 },
  mode: { factory: '0x09Dfee598d5217da799bEAd56206beC0fDB0D17B', fromBlock: 9912410 },
  zklink: { factory: '0xCCA610644f19d7d8f96b90a896B160f54cBE3204', fromBlock: 4734230 },
  core: { factory: '0x5C3027D8Cb28A712413553206A094213337E88c5', fromBlock: 17552799 }

}

const abi = {
  getBalance: "function getBalance(address) view returns (uint256)"
}

Object.keys(config).forEach(chain => {
  const { factory, fromBlock, } = config[chain]
  module.exports[chain] = {
    tvl: async (api) => {
      const logs = await getLogs({
        api,
        target: factory,
        eventAbi: 'event LOG_NEW_POOL (address indexed caller, address indexed pool)',
        onlyArgs: true,
        fromBlock,
      })

      const pools = logs.map(i => i.pool)
      const tokens = await api.multiCall({ abi: 'address[]:getCurrentTokens', calls: pools })
      const calls = []
      const allTokens = []
      let i = 0
      for (const pool of pools) {
        for (const token of tokens[i]) {
          calls.push({ target: pool, params: token })
          allTokens.push(token)
        }
        i++
      }
      const allBals = await api.multiCall({ abi: abi.getBalance, calls })
      api.add(allTokens, allBals)
    }
  }
})