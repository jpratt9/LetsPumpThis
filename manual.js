
let symbol = 'RDD';


const Bittrex = require('node-bittrex-api');

//remote this line and update API_KEY & SECRET
const config = require('./config');

const API_KEY = config.api_key;
const SECRET = config.api_secret;

let multip = 1.3; // This value will be multiply with last ask price for buy order
let BTCAmount = 0.081;

Bittrex.options({
    'apikey': API_KEY,
    'apisecret': SECRET,
});


/**
 * Check Price
 */
Bittrex.getticker({market: 'BTC-' + symbol}, function (ticker) {

    let ask = ticker.result.Ask * multip;

    let quantity = parseInt(BTCAmount / ask) - 1;
    /**
     * Buy
     */
    Bittrex.tradebuy({
        MarketName: 'BTC-' + symbol,
        OrderType: 'LIMIT',
        Quantity: quantity,
        Rate: ticker.result.Ask,
        TimeInEffect: 'GOOD_TIL_CANCELLED',
        ConditionType: 'LESS_THAN',
        Target: ask,
    }, function (data, err) {

        console.log(err);

        if (data !== null) {
            console.log(data);

            /**
             * Balance check
             */
            setTimeout(()=>{

                Bittrex.getbalance({currency: symbol}, function (result, err) {


                    let balance = result.result;
                    Bittrex.tradesell({
                        MarketName: 'BTC-' + symbol,
                        OrderType: 'LIMIT',
                        Quantity: balance.Balance,
                        Rate: ask * 2,
                        TimeInEffect: 'GOOD_TIL_CANCELLED',
                        ConditionType: 'GREATER_THAN',
                        Target: ask  * 2
                    }, function (data, err) {
                        console.log(data);
                        console.log(err);
                    });

                });

            }, 4000);


        } else {
            console.log('Cant buy');
            console.log(err);
        }

    });
});