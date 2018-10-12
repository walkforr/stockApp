//info&news tabs

(function () {
    $("#tab1").hide();
    $("#tab2").hide();
})();

const showTab1 = function () {
	$("#tab1").show();
	$("#tab2").hide();
}

const showTab2 = function () {
	$("#tab1").hide();
	$("#tab2").show();
}

$("#info").on("click", showTab1);
$("#news").on("click", showTab2);

console.log(showTab2);
console.log(showTab1);

//validation list:

let validationList;

const createValidation = function () {
    $.ajax({
        url: `https://api.iextrading.com/1.0/ref-data/symbols`,
        method: 'GET'
    }).then(function (response) {
        validationList = response.symbol;

        pushButtons();
 
    });
 
 };

 


//stocks

const stocks = [ "AAPL", "TSLA", "NKE", "FB", "GOOG" ];

const displayStockInfo = function () {
    const stock = $(this).attr("data-name");
    const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,news&range=1m&last=1`;

    $.ajax({
        url: queryURL,
        method: 'GET'
    }).then(function(response) {
        const stockDiv = $('<div>').addClass('stock');

        const companyName = response.quote.companyName;
        const nameHolder = $('<p>').text(`Company Name: ${companyName}`);
        stockDiv.append(nameHolder);

        const stockSymbol = response.quote.symbol;
        const symbolHolder = $('<p>').text(`Stock Symbol: ${stockSymbol}`);
        stockDiv.append(symbolHolder);

        const stockPrice = response.quote.latestPrice;
        const priceHolder = $('<p>').text(`Stock Price: ${stockPrice}`);
        stockDiv.append(priceHolder);
        
        $('#tab1').html(stockDiv);

        //news

        const newsDiv = $('<div class="newsDiv">');
       for(let i=0; i<response.news.length; i++){
           newsBin.append(`<p>${response.news[i].summary}</p>`)
       }

        $('#tab2').html(newsDiv);


    });

}



    //display stock history + add



    const renderStocks = function () {

        $('.history').empty();

        for (let i = 0; i < stocks.length; i++) {
            
            const newButton = $('<h3>');
            newButton.addClass('stockBtn');

            newButton.attr('data-name', stocks[i]);
            newButton.text(stocks[i]);

            $('.history').append(newButton);

        }
    }

    const pushButtons = function (validationList) {
        $(".searchBtn").on('click', function () {
     
            let input = $('.search').val().toUpperCase();
     
            for (let i = 0; i < validationList.length; i++) {
                if (input === validationList[i].symbol) {
                    stocks.push(input)
     
                    renderStocks();
                }
            }
        })
     
     };

    const addButton = function(e) {
        e.preventDefault();
        const stock = $('.search').val().trim();
        stocks.push(stock);

        $('.search').val('');

        renderStocks();
    }

    $('.searchBtn').on('click', addButton);
    $('.history').on('click', '.stockBtn', displayStockInfo);

    renderStocks();