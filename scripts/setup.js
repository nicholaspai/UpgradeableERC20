const contract = require("truffle-contract");

// ABI's of contracts
const BalanceSheet_abi = require('../build/contracts/BalanceSheet');
const AllowanceSheet_abi = require('../build/contracts/AllowanceSheet');
const Token_V0_abi = require('../build/contracts/Token_V0');
const TokenProxy_abi = require('../build/contracts/TokenProxy');

let BalanceSheet = contract(BalanceSheet_abi);
let AllowanceSheet = contract(AllowanceSheet_abi);
let Token_V0 = contract(Token_V0_abi)
let TokenProxy = contract(TokenProxy_abi)

// Set providers
BalanceSheet.setProvider(web3.currentProvider)
AllowanceSheet.setProvider(web3.currentProvider)
Token_V0.setProvider(web3.currentProvider)
TokenProxy.setProvider(web3.currentProvider)

module.exports = function(callback) {

    // Token Proxy must claim ownership of storage sheets before its methods will work
    Token_V0.deployed().then(function (impl_v0) {
        console.log('Token_V0 deployed: ' + impl_v0.address)
        BalanceSheet.deployed().then(function (balances) {
          console.log('BalanceSheet deployed: ' + balances.address)
          AllowanceSheet.deployed().then(function (allowances) {
            console.log('AllowanceSheet deployed: ' + allowances.address)
            TokenProxy.deployed().then(function(proxy) {
              console.log('TokenProxy deployed: ' + proxy.address)
              balances.transferOwnership(proxy.address, {from:owner}).then(function() {
                allowances.transferOwnership(proxy.address, {from:owner}).then(function() {
                  proxy.claimBalanceOwnership().then(function() {
                    proxy.claimAllowanceOwnership().then(function () {

                    })
                  })
                })
              })
            })
          })
        })
      })

}
