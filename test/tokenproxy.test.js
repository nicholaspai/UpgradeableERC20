const { CommonVariables, ZERO_ADDRESS, expectThrow } = require('./helpers/common')

const { TokenProxy, Token_V0, Token_V1, BalanceSheet, AllowanceSheet } = require('./helpers/common');

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
        describe('approve is enabled in V0', function () {
            const amount = 10 * 10 ** 18
            it('approves user to spend for token holder', async function () {
                await this.tokenProxy.approve(user, amount, { from: proxyOwner })
                const allowance = await this.tokenProxy.allowance(proxyOwner, user)
                assert.equal(allowance, amount)
            }) 
        })
    })

    describe('upgradeTo v1', function () {

        beforeEach(async function () {
            // Second logic contract
            this.impl_v1 = (await Token_V1.new(ZERO_ADDRESS, ZERO_ADDRESS, { from:owner })).address
        })
        describe('owner calls upgradeTo', function () {
            const from = proxyOwner

            beforeEach(async function () {
                const { logs } = await this.proxy.upgradeTo(this.impl_v1, { from })
                this.logs = logs
                this.event = this.logs.find(l => l.event === 'Upgraded').event
                this.newImplementation = this.logs.find(l => l.event === 'Upgraded').args.implementation
            })
            it('upgrades to V1 implementation', async function () {
                this.implementation = await this.proxy.implementation()
                assert.equal(this.implementation, this.impl_v1)
            })
            it('emits an Upgraded event', async function () {
                assert.equal(this.logs.length, 1)
                assert.equal(this.newImplementation, this.impl_v1)
            })
        })
        describe('Non-proxy-owner calls upgradeTo', function () {
            const from = owner
            it('reverts', async function () {
                await expectThrow(this.proxy.upgradeTo(this.impl_v1, {from}))
            })
        })
        describe('Proxy can now delegate calls to V1 logic contract', function () {
            beforeEach(async function () {
                await this.proxy.upgradeTo(this.impl_v1, { from:proxyOwner })
                this.tokenProxy = Token_V1.at(this.proxyAddress)

                await this.allowances.transferOwnership(this.tokenProxy.address)
                await this.balances.transferOwnership(this.tokenProxy.address)
                await this.tokenProxy.claimBalanceOwnership()
                await this.tokenProxy.claimAllowanceOwnership()
            })
            describe('proxy storages do not change', function () {
                it('Proxy has original balances, allowances after upgrade', async function () {
                    assert.equal(await this.tokenProxy.balances(), this.balances.address)
                    assert.equal(await this.tokenProxy.allowances(), this.allowances.address)
                })
            })
            describe('totalSupply', function () {
                it('returns totalSupply', async function () {
                    const supply = await this.tokenProxy.totalSupply()
                    assert.equal(supply, 0)
                })
            })
            describe('approve is disabled by default in V1', function () {
                const amount = 10 * 10 ** 18
                it('reverts', async function () {
                    await expectThrow(this.tokenProxy.approve(user, amount, { from: proxyOwner }))
                }) 
            })
            describe('increaseApproval now enabled in V1', function () {
                const amount = 10 * 10 ** 18
                it('increases user allowance', async function () {
                    await this.tokenProxy.increaseApproval(user, amount, { from: proxyOwner })
                }) 
            })
        })
    })
})