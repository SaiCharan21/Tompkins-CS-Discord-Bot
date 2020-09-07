const GoogleSpreadsheet =  require('google-spreadsheet')
const { promisify } = require('util')

const creds = require('./TompkinsCS-e8b9eb955d42.json')

async function accessSpreadsheet(){
    const doc= new GoogleSpreadsheet('1jgCaGa5LAz6eORk2w-62UfzNcLe6XXYHg2ttuTToSAA')
    await promisify(doc.useServiceAccountAuth)(creds)
    const info = await promisify(doc.getInfo)()
    const sheet = info.worksheets[0]
    console.log(`Title: ${sheet.title}, Rows: ${sheet.rowCount}`)
}

accessSpreadsheet()