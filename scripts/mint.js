const contract = require("truffle-contract");

// ABI's of contracts
const TokenProxy_abi = require('../build/contracts/TokenProxy.json')
const Token_V0_abi = require('../build/contracts/Token_V0.json')

// Addresses of contracts
let who = '0x8E257e917200895d48850e4B50994DD75df3E38E'
let from = '0x0e91c2421d001a7ab5e39bca735c6ec6a0621df8'

let TokenProxy = contract(TokenProxy_abi);
let Token_V0 = contract(Token_V0_abi);

// Set providers
TokenProxy.setProvider(web3.currentProvider)
Token_V0.setProvider(web3.currentProvider)


// Constants
let gasPrice = web3.toWei('25', 'gwei')
let amountToMint = 100
let conversion = 10**18

module.exports = function(callback) {

    console.log('Who to mint coins to: ' + who)

    TokenProxy.deployed().then(proxy => {
            Token_V0.at(proxy.address).then(v0 => {
                        v0.mint(who, amountToMint*conversion, {from, gasPrice}).then(tx => {
                            let mintEvent = tx.logs[tx.logs.length-1]
                            console.log(mintEvent.event + ": amount = " + mintEvent.args.value)
                        })
            })
    })
}
