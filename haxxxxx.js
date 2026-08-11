function pushCsvToGithub() {
  var TOKEN = "TOKEN HERE";
  var OWNER = "Zack9725";
  var REPO = "Shipping";
  var PATH = "data.csv";

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
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

  var apiUrl = "https://api.github.com/repos/" + OWNER + "/" + REPO + "/contents/" + PATH;
  var headers = { "Authorization": "Bearer " + TOKEN, "Accept": "application/vnd.github+json" };

  var sha = null;
  var getRes = UrlFetchApp.fetch(apiUrl, { headers: headers, muteHttpExceptions: true });
  Logger.log("GET status: " + getRes.getResponseCode() + " | " + getRes.getContentText());
  if (getRes.getResponseCode() === 200) {
    sha = JSON.parse(getRes.getContentText()).sha;
  }

  var payload = {
    message: "Auto-update PN data " + new Date().toISOString(),
    content: Utilities.base64Encode(csv),
    branch: "main"
  };
  if (sha) payload.sha = sha;

  var putRes = UrlFetchApp.fetch(apiUrl, {
    method: "put",
    contentType: "application/json",
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  Logger.log("PUT status: " + putRes.getResponseCode() + " | " + putRes.getContentText());
}
