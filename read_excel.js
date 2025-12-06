const XLSX = require('xlsx');
const fs = require('fs');

try {
  const workbook = XLSX.readFile('JOURNAL.xlsx');
  const sheetNames = workbook.SheetNames;
  
  console.log('Sheets:', sheetNames);
  
  sheetNames.forEach(name => {
    console.log(`\n--- Sheet: ${name} ---`);
    const worksheet = workbook.Sheets[name];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // Print first 10 rows
    console.log(jsonData.slice(0, 10));
  });
} catch (error) {
  console.error('Error reading file:', error);
}
