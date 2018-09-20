var Token_V1 = artifacts.require("./Token_V1.sol");

module.exports = function(deployer) {
  deployer.deploy(Token_V1);
};
