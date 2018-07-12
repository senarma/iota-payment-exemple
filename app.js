const express = require('express')
const IOTA = require('iota.lib.js')
const iota = new IOTA({provider: 'https://nodes.testnet.iota.org:443'})
const seed = 'PUT YOUR SEED'


let options = {
    checksum:true,
    security:2
}

const app = express()
const http = require('http').Server(app)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.use(express.static('img'))

http.listen(3000, () => {
    console.log('Web Server OK at 3000')
})

const io = require('socket.io')(http)


io.on('connection', (socket) => {
    console.log('Connection run...')
    iota.api.getNewAddress(seed, options, (error, newAddress) => {
    if(error){
        console.log(error)
    } else {
        console.log('New address generated: ' + newAddress)
        const transfers = [{
            address: newAddress,
            value:0
        }]
        iota.api.sendTransfer(seed, 3, 9, transfers, (error, success) => {
            if(error){
                console.log(error)
            } else {
                console.log(success)
                socket.emit('newaddress', newAddress)
                CheckBalance(newAddress, socket)
                }
            })
        }
    })

})
function CheckBalance(addressToCheck, socket)
{
    iota.api.getBalances([addressToCheck], 100, function(error, success){
        if(error || !success)
        {
            console.log(error)
        }
        if(!success.balances){
            console.log('Missing balances in response')
        }
        else
        {
            success.balances.forEach(result => {
                
            if(result>0)
            {
                socket.emit('unlocked', addressToCheck)
                console.log('Payment OK on the address: '+ addressToCheck)
            }
        });
        CheckBalance(addressToCheck, socket)

        }
    })
}

