var TokenProxy = artifacts.require("./TokenProxy.sol");
var Token_V0 = artifacts.require("./Token_V0.sol");
var BalanceSheet = artifacts.require("./BalanceSheet.sol");
var AllowanceSheet = artifacts.require("./AllowanceSheet.sol");

module.exports = function(deployer, network, accounts) {
  let owner = accounts[0];
  Token_V0.deployed().then(function (impl_v0) {
  	BalanceSheet.deployed().then(function (balances) {
  		AllowanceSheet.deployed().then(function (allowances) {
  			deployer.deploy(TokenProxy, impl_v0.address, balances.address, allowances.address, {from:owner});
  		})
  	})
  })
};
