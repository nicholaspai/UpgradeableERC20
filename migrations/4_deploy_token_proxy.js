var TokenProxy = artifacts.require("./TokenProxy.sol");
var Token_V0 = artifacts.require("./Token_V0.sol");
var BalanceSheet = artifacts.require("./BalanceSheet.sol");
var AllowanceSheet = artifacts.require("./AllowanceSheet.sol");

module.exports = function(deployer, network, accounts) {
  let owner = accounts[0];
  console.log('owner of proxy contract: ' + owner)
  deployer.deploy(TokenProxy, Token_V0.address, BalanceSheet.address, AllowanceSheet.address, {from:owner});

};
