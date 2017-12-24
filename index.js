const Twit = require('twit');
const names = require('./names.js');
const Bittrex = require('node-bittrex-api');

const API_KEY = '';
const SECRET = '';

let IDChecked = [];
let multip = 1.25; // This value will be multiply with last ask price for buy order
let BTCAmount = 0.1;

Bittrex.options({
    'apikey': API_KEY,
    'apisecret': SECRET,
});

const T = new Twit({
    consumer_key: 'EtOiey9DWfAeGBSAdARVnQ',
    consumer_secret: 'wy9SUMOEeFKeRYn5R9PiF0p2Ir5Oz8uplGnI045e9o',
    access_token: '176911783-seArpdcBUDJ3RD2ysOtc39OOTLO39LOXcDZzcu1i',
    access_token_secret: 'sNHJGbEek0x8pfGCvUgNM6ZR66yFsvHDVg9ICLab7N0Sk'
});

let stream = T.stream('statuses/filter', {follow: '176911783' /*'961445378' */});

stream.on('tweet', (tweet, err) => {
    if (!isIn(tweet.id)) {
        checkTweet(tweet.text);
    } else {
        console.log(`Found tweet ${tweet.id} but it has already been processed`);
    }
})

function checkTweet(text) {
    text = text.toLowerCase();

    for (let val of names) {
        if (text.includes("("+val.toLowerCase()+")") && text.toLowerCase().includes('coin of the day')) {

            console.log(`${text} :: ${val}`);
            /**
             * Check Price
             */
            Bittrex.getticker( { market : 'BTC-'+val.toUpperCase() }, function( ticker ) {

                let ask = ticker.result.Ask  * multip;

                let quantity = parseInt(BTCAmount / ask)-1;
                /**
                 * Buy
                 */
                Bittrex.tradebuy({
                    MarketName: 'BTC-'+val.toUpperCase(),
                    OrderType: 'LIMIT',
                    Quantity: quantity,
                    Rate: ask,
                    TimeInEffect: 'GOOD_TIL_CANCELLED',
                    ConditionType: 'NONE',
                    Target: 0,
                }, function( data, err ) {

                    console.log( data );
                    console.log( err );

                    let realAmount = data.bişi

                    Bittrex.tradesell({
                        MarketName: 'BTC-'+val.toUpperCase(),
                        OrderType: 'LIMIT',
                        Quantity: 1.00000000,
                        Rate: ask * multip * 2.5,
                        TimeInEffect: 'GOOD_TIL_CANCELLED',
                        ConditionType: 'LESS_THAN',
                        Target: 0,
                    }, function( data, err ) {
                        console.log( data );
                        console.log( err );
                    });

                });

            });



        }
    }

}

function isIn(id) {
    for (var val of IDChecked) {
        if (val === id) {
            return true;
        }
    }
    IDChecked.push(id);
    return false;
}


/*
Make sure below is commented out otherwise it will go bad
Test @ works Made Purchase {"orderNumber":"91514514058","resultingTrades":[{"amount":"0.00270000","date":"2017-12-24 ","rate":"0.03711015","total":"0.00010019","tradeID":"","type":"buy"}]}
//let a = 'zec coin of the day';

//checkTweet(a);
*/
