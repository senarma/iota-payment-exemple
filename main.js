let paymentAddress
$(function(){
    const socket = io();

    socket.on('newaddress', function(address){
        paymentAddress = address
        $('#mainImage').attr('src','pay.png')
        $('#text').html('You need to send 1 IOTA to this address: <br/>'+ address)
    })
    socket.on('unlocked', function(unlockedAddress){
        if(unlockedAddress===paymentAddress){
            $('#mainImage').attr('src','unlocked.png')
            $('#text').html('Payment Confirmed - Acess Token: ' +Math.floor(Math.random() * 6))
        }
    })
})
