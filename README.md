# UpgradeableERC20
	Demo Mintable, Burnable, Standard ERC20 with ability to upgrade to a more secure Pausable and Lockable ERC20

# How to use:
0) install dependencies `npm install`
1) Deploy on ropsten with `truffle migrate --network ropsten` 
2) Run all tests with `npm run test-all` 
3) Test locally after spinning up local Ethereum emulator with `npm run testrpc`
4) Run any scripts with `truffle exec ./scripts/[script.js]` For example, run `truffle exec ./scripts/checkSetup.js` after delpoyment to confirm that ownerships were setup properly by `5_setup.js`
5) Mocha gas reporter is enabled for more robust testing feedback, but can be commented out to speed up tests (see truffle-config.js)

# Gas estimation costs for deploying contracts on Ropsten:
Total cost on Ropsten: < .8 ETH
0 Migrations: .03 ETH
1 BalanceSheet: .08 ETH
1 AllowanceSheet: .08 ETH
2 Token_V0: .2 ETH
2 Token_V1: .3 ETH
3 TokenProxy .09 ETH
4 Setup scripts, no contracts deployed: < .01 ETH 

