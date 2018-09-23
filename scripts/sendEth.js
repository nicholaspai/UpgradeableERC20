let who = '0x8E257e917200895d48850e4B50994DD75df3E38E'
let from = '0x0e91c2421d001a7ab5e39bca735c6ec6a0621df8'
let amount = 10.0

module.exports = function(callback) {
    web3.eth.sendTransaction({ 
        from,
        to: who,
        value: web3.toWei(amount, "ether")
    }, function(err, hash) {
        if (!err) {
            console.log("Sent " + amount + " ETH to " + who + ", txn hash: " + hash)
        }
        else {
            console.error(err)
        }
    })
}
