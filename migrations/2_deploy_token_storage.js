var BalanceSheet = artifacts.require("./BalanceSheet.sol");
var AllowanceSheet = artifacts.require("./AllowanceSheet")

module.exports = function(deployer, network, accounts) {
  let owner = accounts[0];
  deployer.deploy(BalanceSheet, {from: owner});
  deployer.deploy(AllowanceSheet, {from: owner});
};
