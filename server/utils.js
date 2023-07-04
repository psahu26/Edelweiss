function extractDateFromTradingSymbol(tradingSymbol) {
    // Define the regular expression pattern for the date in the symbol
    const datePattern = /\d{2}[A-Za-z]{3}\d{2}/;
    // Use regular expression match to find the date in the symbol
    const matchedDate = tradingSymbol.match(datePattern);
    // Return the matched date or null if no date is found
    return matchedDate ? matchedDate[0] : null;
}

function extractTradingNameFromSymbol(tradingSymbol) {
    const [matchedLetters] = tradingSymbol.match(/^[A-Za-z]+/);
    return matchedLetters
}
function extractOptionTypeFromSymbol(tradingSymbol) {
    if (tradingSymbol.includes('PE')) {
        return 'Puts';
    } else if (tradingSymbol.includes('CE')) {
        return 'Calls';
    } else if (tradingSymbol.includes('XX')) {
        return 'Future';
    } else {
        return 'Unknown';
    }
}

function extractStrikePriceFromSymbol(tradingSymbol) {
    // Define the regular expression pattern for the strike price in the symbol
    const strikePrice = /\d+(?=[A-Za-z]{2}$)/;
    // Use regular expression match to find the strike price in the symbol
    const matchedStrikePrice = tradingSymbol.match(strikePrice);

    // Return the matched strike price or null if not found
    return matchedStrikePrice ? matchedStrikePrice[0].substring(2) : null;
}

function unixTimestampToDate(unixTimestamp) {
    // Create a new Date object using the Unix timestamp (in milliseconds)
    const date = new Date(unixTimestamp);

    // Get the components of the date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Return the formatted date string
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}






module.exports = {
    extractDateFromTradingSymbol,
    extractTradingNameFromSymbol,
    extractOptionTypeFromSymbol,
    extractStrikePriceFromSymbol,
    unixTimestampToDate,
};
