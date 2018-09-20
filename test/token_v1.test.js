const { Token_V1_Tests } = require('./Token_V1.js');
const { Token_V1, BalanceSheet, AllowanceSheet } = require('./helpers/common');
const { CommonVariables, ZERO_ADDRESS, expectThrow } = require('./helpers/common');

contract('Token_V1', _accounts => {
    const commonVars = new CommonVariables(_accounts);
    const owner = commonVars.owner
    const tokenHolder = commonVars.user
    const otherAccount = commonVars.user2
    
    beforeEach(async function () {
        // Set up TokenStorage
        this.allowances = await AllowanceSheet.new( {from:owner })
        this.balances = await BalanceSheet.new({ from:owner })

        // Set up Token
        this.token_V1 = await Token_V1.new(this.balances.address, this.allowances.address, {from:owner})

        // If Token does not own storage contracts, then the storage contracts must
        // transfer ownership to the token contract and then the token must claim
        // ownership to complete two stage ownership transfer
        await this.allowances.transferOwnership(this.token_V1.address)
        await this.balances.transferOwnership(this.token_V1.address)
        await this.token_V1.claimBalanceOwnership()
        await this.token_V1.claimAllowanceOwnership()
    })


    describe("V1 Token behavior tests", function () {
        Token_V1_Tests(owner, tokenHolder, otherAccount);
    });
})
