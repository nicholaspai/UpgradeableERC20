const contract = require("truffle-contract");

// ABI's of contracts
const TokenProxy_abi = require('../build/contracts/TokenProxy.json')
const Token_V0_abi = require('../build/contracts/Token_V0.json')
const Token_V1_abi = require('../build/contracts/Token_V1.json')
const BalanceSheet_abi = require('../build/contracts/BalanceSheet.json')
const AllowanceSheet_abi = require('../build/contracts/AllowanceSheet.json')

let TokenProxy = contract(TokenProxy_abi);
let Token_V0 = contract(Token_V0_abi);
let Token_V1 = contract(Token_V1_abi)
let BalanceSheet = contract(BalanceSheet_abi);
let AllowanceSheet = contract(AllowanceSheet_abi);

// Set providers
TokenProxy.setProvider(web3.currentProvider)
Token_V0.setProvider(web3.currentProvider)
Token_V1.setProvider(web3.currentProvider)
BalanceSheet.setProvider(web3.currentProvider)
AllowanceSheet.setProvider(web3.currentProvider)

// Constants
let gasPrice = web3.toWei('25', 'gwei')
let amountToMint = 100
let conversion = 10**18

module.exports = function(callback) {

    TokenProxy.deployed().then(proxy => {
    	console.log('proxy address: ' + proxy.address)
		proxy.owner().then(owner => {
			console.log('proxy owner: ' + owner)
		})
		proxy.implementation().then(implementation => {
			console.log('proxy initial logic contract: ' + implementation)
		})
		proxy.balances().then(balances => {
			console.log('proxy balances: ' + balances)
		})
		proxy.allowances().then(allowances => {
			console.log('proxy allowances: ' + allowances)
		})
	})

	Token_V0.deployed().then(v0 => {
		console.log('v0 address: ' + v0.address)
		v0.owner().then(owner => {
			console.log('v0 owner: ' + owner)
		})
		v0.balances().then(balances => {
			console.log('v0 balances: ' + balances)
		})
		v0.allowances().then(allowances => {
			console.log('v0 allowances: ' + allowances)
		})
	})

	Token_V1.deployed().then(v1 => {
		console.log('v1 address: ' + v1.address)
		v1.owner().then(owner => {
			console.log('v1 owner: ' + owner)
		})
		v1.balances().then(balances => {
			console.log('v1 balances: ' + balances)
		})
		v1.allowances().then(allowances => {
			console.log('v1 allowances: ' + allowances)
		})
	})

	BalanceSheet.deployed().then(storage => {
		console.log('balanceSheet address: ' + storage.address)
		storage.owner().then(owner => {
			console.log('balanceSheet owner: ' + owner)
		})
	})

	AllowanceSheet.deployed().then(storage => {
		console.log('allowanceSheet address: ' + storage.address)
		storage.owner().then(owner => {
			console.log('allowanceSheet owner: ' + owner)
		})
	})
}
