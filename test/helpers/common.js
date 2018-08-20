/* Loading all imports */
const expectThrow = require('./expectThrow');
const assertBalance = require('./assertBalance');
const ZERO_ADDRESS = 0x0000000000000000000000000000000000000000;
const RANDOM_ADDRESS = 0x3b5855bAEF50EBFdFC89c5E5463f92BCe194EAc9; 

/* Creating a class with all common Variables */
class CommonVariables {
    constructor(_accounts) {
        this.accounts = _accounts;
        this.owner = _accounts[0];
        this.user = _accounts[1];
        this.attacker = _accounts[2];
        this.user2 = _accounts[3];
        this.user3 = _accounts[4];
        this.user4 = _accounts[7];
        this.user5 = _accounts[8];
    }
}

/* Contract ABI */
const BalanceSheet = artifacts.require("BalanceSheet")
const AllowanceSheet = artifacts.require("AllowanceSheet")
const Token_V0 = artifacts.require("Token_V0")
const TokenProxy = artifacts.require("TokenProxy")

/* Exporting the module */
module.exports = {
    expectThrow,
    assertBalance,
    CommonVariables,
    ZERO_ADDRESS,
    RANDOM_ADDRESS,
    BalanceSheet,
    AllowanceSheet,
    Token_V0,
    TokenProxy
}