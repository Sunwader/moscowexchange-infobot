const { google } = require('googleapis');
const { getAuthClient } = require('./googleAuth');

const getApiClient = async () => {
    const authClient = await getAuthClient();
    const { spreadsheets: apiClient } = google.sheets( {
        version : 'v4',
        auth    : authClient,
    } );

    return apiClient;
};

const getValuesData = async ( apiClient, range ) => {
    const { data } = await apiClient.get( {
        spreadsheetId   : '1m4_wt44fr3VVpoA634TbzAoQ-m_5wATNgIEDDz7_4lQ',
        ranges          : range,
        fields          : 'sheets',
        includeGridData : true,
    } );

    return data.sheets;
};

const findRowIndex = ( sheet, message ) => {
    const rowIndex = sheet.data[0].rowData.findIndex( ( item ) => (
        item.values[1].formattedValue === message || item.values[0].formattedValue === message
    ));

    return rowIndex;
};

const answersFromBot = async (ctx ) => {
    const range = 'АПИ';

    const message = ctx.message.text;
    const apiClient = await getApiClient();
    const [sheet] = await getValuesData( apiClient, range );
    const rowIndex = findRowIndex( sheet, message );

    const ticker = sheet.data[0].rowData[rowIndex].values[0].formattedValue;
    const companyName = sheet.data[0].rowData[rowIndex].values[1].formattedValue;
    const price = sheet.data[0].rowData[rowIndex].values[2].formattedValue;
    const lot = sheet.data[0].rowData[rowIndex].values[3].formattedValue;
    const listing = sheet.data[0].rowData[rowIndex].values[4].formattedValue;
    const nominal = sheet.data[0].rowData[rowIndex].values[5].formattedValue;
    const code = sheet.data[0].rowData[rowIndex].values[6].formattedValue;

ctx.reply(`
Компания:  ${companyName}
Тикер:  ${ticker}
Текущая цена:  ${price} ₽
Лот:  ${lot}
Уровень листинга:  ${listing}
Номинальная стоимость одной ценной бумаги:  ${nominal} ₽
Международный код ценной бумаги:  ${code}
`);


    // console.log( sheet );
    // console.log(sheet.data[0].rowData)
    // console.log(sheet.data[0].rowData[3])
    // console.log( sheet.data[0].rowData[rowIndex].values[3]);
};

module.exports = {
    answersFromBot,
};
