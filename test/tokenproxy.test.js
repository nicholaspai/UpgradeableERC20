const { CommonVariables, ZERO_ADDRESS, expectThrow } = require('./helpers/common')

const { TokenProxy, Token_V0, BalanceSheet, AllowanceSheet } = require('./helpers/common');

contract('TokenProxy', _accounts => {
    const commonVars = new CommonVariables(_accounts);
    const owner = commonVars.owner;
    const proxyOwner = commonVars.user;
    const user = commonVars.user2;

    beforeEach(async function () {
        // Empty Proxy Data storage
        this.balances = await BalanceSheet.new({ from: owner })
        this.allowances = await AllowanceSheet.new({ from: owner })
        
        // First logic contract
        this.impl_v0 = (await Token_V0.new(ZERO_ADDRESS, ZERO_ADDRESS, { from:owner })).address

        // Setting up Proxy initially at version 0 with data storage
        this.proxy = await TokenProxy.new(this.impl_v0, this.balances.address, this.allowances.address, { from:proxyOwner })
        this.proxyAddress = this.proxy.address
    })

    describe('implementation', function () {
        const from = proxyOwner
        it('returns the Token implementation address', async function () {
            this.implementation = await this.proxy.implementation({from})
            assert.equal(this.implementation, this.impl_v0)
        })
    })

    describe('Proxy delegates calls to V0 logic contract', function () {
        beforeEach(async function () {
            this.tokenProxy = Token_V0.at(this.proxyAddress)
            this.logic_v0 = Token_V0.at(this.impl_v0)

            await this.allowances.transferOwnership(this.tokenProxy.address)
            await this.balances.transferOwnership(this.tokenProxy.address)
            await this.tokenProxy.claimBalanceOwnership()
            await this.tokenProxy.claimAllowanceOwnership()
        })
        it('tokenProxy owns data storages', async function () {
            assert.equal(await this.tokenProxy.address, await this.allowances.owner())
            assert.equal(await this.tokenProxy.address, await this.balances.owner())
        })
        describe('totalSupply', function () {
            it('returns totalSupply', async function () {
                const supply = await this.tokenProxy.totalSupply()
                assert.equal(supply, 0)
            })
        })
    })

    // describe('upgradeTo v1', function () {

    //     beforeEach(async function () {
    //         // Second logic contract 
    //         this.permissionSheet_v1 = await PermissionSheetMock.new( {from:owner })
    //         this.validatorSheet_v1 = await ValidatorSheetMock.new(validator, {from:owner} )
    //         this.token_logic_v1_regulator = (await Regulator.new(this.permissionSheet_v1.address, this.validatorSheet_v1.address, { from:owner })).address
    //         this.impl_v1 = (await PermissionedToken.new(this.token_logic_v1_regulator, this.proxyBalancesStorage, this.proxyAllowancesStorage,{ from:owner })).address
    //     })
    //     describe('owner calls upgradeTo', function () {
    //         const from = proxyOwner

    //         beforeEach(async function () {
    //             const { logs } = await this.proxy.upgradeTo(this.impl_v1, { from })
    //             this.tokenProxy = PermissionedToken.at(this.proxyAddress)

    //             this.logic_v0 = PermissionedToken.at(this.impl_v0)
    //             this.logic_v1 = PermissionedToken.at(this.impl_v1)

    //             this.logs = logs
    //             this.event = this.logs.find(l => l.event === 'Upgraded').event
    //             this.newImplementation = this.logs.find(l => l.event === 'Upgraded').args.implementation
    //         })
    //         it('upgrades to V1 implementation', async function () {
    //             this.implementation = await this.proxy.implementation( { from })
    //             assert.equal(this.implementation, this.impl_v1)
    //         })
    //         it('emits an Upgraded event', async function () {
    //             assert.equal(this.logs.length, 1)
    //             assert.equal(this.newImplementation, this.impl_v1)
    //         })
    //         describe('proxy storages do not change even though logic storages changes', function () {
    //             it('V0 logic has original balances, allowances, and regulator...', async function () {
    //                 assert.equal(await this.logic_v0.balances(), this.proxyBalancesStorage)
    //                 assert.equal(await this.logic_v0.allowances(), this.proxyAllowancesStorage)
    //                 assert.equal(await this.logic_v0.regulator(), this.proxyRegulator)
    //             })
    //             it('V1 logic has a new regulator', async function () {
    //                 assert.equal(await this.logic_v1.regulator(), this.token_logic_v1_regulator)
    //             })
    //             it('proxy storage maintains its original regulator', async function () {
    //                 assert.equal(await this.proxy.regulator(), this.proxyRegulator)
    //             })
    //         })
    //     })
    //     describe('Regulator implementation owner calls upgradeTo', function () {
    //         const from = owner
    //         it('reverts', async function () {
    //             await expectRevert(this.proxy.upgradeTo(this.impl_v1, {from}))
    //         })
    //     })
    // })
})