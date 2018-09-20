var Token_V0 = artifacts.require("./Token_V0.sol");
var Token_V1 = artifacts.require("./Token_V1.sol");

module.exports = function(deployer, network, accounts) {
  const ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
  let owner = accounts[0];
  deployer.deploy(Token_V0, ZERO_ADDRESS, ZERO_ADDRESS, {from:owner});
  deployer.deploy(Token_V1, ZERO_ADDRESS, ZERO_ADDRESS, {from:owner});
};
