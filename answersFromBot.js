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
        item.values[0].formattedValue === message
    ) );

    return rowIndex;
};

const answersFromBot = async (ctx ) => {
    const range = 'АПИ';

    const message = ctx.message.text;
    const apiClient = await getApiClient();
    const [sheet] = await getValuesData( apiClient, range );
    const rowIndex = findRowIndex( sheet, message );
    const price = sheet.data[0].rowData[rowIndex].values[1].formattedValue;

    ctx.reply(`Текущая цена акции ${message}:  ${price} ₽`);

    // console.log( sheet.data[0].rowData[rowIndex].values[1]);
};

module.exports = {
    answersFromBot,
};
