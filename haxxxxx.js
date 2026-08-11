function pushCsvToGithub() {
  var TOKEN = "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";
  var OWNER = "Zack9725";
  var REPO = "QuickShip";
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
  try {
    var getRes = UrlFetchApp.fetch(apiUrl, { headers: headers, muteHttpExceptions: true });
    var getJson = JSON.parse(getRes.getContentText());
    sha = getJson.sha || null;
  } catch (e) {}

  var payload = {
    message: "Auto-update PN data " + new Date().toISOString(),
    content: Utilities.base64Encode(csv),
    branch: "main"
  };
  if (sha) payload.sha = sha;

  UrlFetchApp.fetch(apiUrl, {
    method: "put",
    contentType: "application/json",
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
