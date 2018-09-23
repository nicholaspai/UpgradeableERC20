# UpgradeableERC20
	Demo Mintable, Burnable, Standard ERC20 with ability to upgrade to a more secure Pausable and Lockable ERC20

# How to use:
1) Deploy on blockchain with `truffle migrate --network [chosen network]`
2) Run all tests with `npm run test-all` 
3) Test locally after spinning up local Ethereum emulator with `npm run testrpc`
4) Run any scripts with `truffle exec ./scripts/[script]`
5) Mocha gas reporter is enabled for more robust testing feedback, but can be commented out to speed up tests (see truffle-config.js)
