function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1"); // tukar nama tab kalau lain
  var data = sheet.getDataRange().getValues();
  var csv = data.map(function(row) {
    return row.map(function(cell) {
      var val = String(cell);
      if (val.indexOf(",") !== -1 || val.indexOf('"') !== -1) {
        val = '"' + val.replace(/"/g, '""') + '"';
      }
      return val;
    }).join(",");
  }).join("\n");
  return ContentService.createTextOutput(csv).setMimeType(ContentService.MimeType.CSV);
}
