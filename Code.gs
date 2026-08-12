/**
 * ====== CONFIG ======
 * Adjust these if your layout changes.
 */
var FIRST_ROW = 18;
var LAST_ROW = 24;          // H18:I24 and J18:M24 are merged across this whole block
var MAX_ROWS = LAST_ROW - FIRST_ROW + 1; // 7

/**
 * Adds a custom menu so you can open the form with one click.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Input Form')
    .addItem('Open Input Form', 'showInputDialog')
    .addToUi();
}

/**
 * Opens the HTML dialog.
 */
function showInputDialog() {
  var html = HtmlService.createHtmlOutputFromFile('Dialog')
    .setWidth(650)
    .setHeight(520);
  SpreadsheetApp.getUi().showModalDialog(html, 'Masukkan Item');
}

/**
 * Takes HTS code as plain digits (e.g. "0000000000") and formats it
 * as "0000 00 0000". Strips any non-digit characters first.
 * Throws an error if it doesn't have exactly 10 digits.
 */
function formatHtsCode(raw) {
  if (!raw) return '';
  var digits = raw.toString().replace(/\D/g, '');
  if (digits.length !== 10) {
    throw new Error('HTS code "' + raw + '" mesti 10 digit (cth: 0000000000).');
  }
  return digits.substring(0, 4) + ' ' + digits.substring(4, 6) + ' ' + digits.substring(6, 10);
}

/**
 * Called from Dialog.html when user submits.
 * rows = [{item, hts, qty, berat, pickSlip}, ...]
 */
function submitRows(rows) {
  if (!rows || rows.length === 0) {
    throw new Error('Tiada data untuk dimasukkan.');
  }
  if (rows.length > MAX_ROWS) {
    throw new Error('Maksimum ' + MAX_ROWS + ' baris sahaja dibenarkan.');
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Clear previous entries in the block first (values only, formatting untouched)
  for (var r = FIRST_ROW; r <= LAST_ROW; r++) {
    sheet.getRange('A' + r).clearContent();
    sheet.getRange('D' + r + ':E' + r).clearContent();
    sheet.getRange('F' + r + ':G' + r).clearContent();
  }

  var totalBerat = 0;
  var pickSlipTokens = [];

  rows.forEach(function (row, idx) {
    var r = FIRST_ROW + idx;

    // Item / HTS / Qty - written as-is, per row
    sheet.getRange('A' + r).setValue(row.item || '');
    sheet.getRange('D' + r + ':E' + r).setValue(formatHtsCode(row.hts));
    sheet.getRange('F' + r + ':G' + r).setValue(row.qty || '');

    // Berat - accumulate
    var beratVal = parseFloat(row.berat);
    if (!isNaN(beratVal)) {
      totalBerat += beratVal;
    }

    // Pick slip - split on comma, trim, dedupe, accumulate
    if (row.pickSlip) {
      row.pickSlip.split(',').forEach(function (tok) {
        tok = tok.trim();
        if (tok && pickSlipTokens.indexOf(tok) === -1) {
          pickSlipTokens.push(tok);
        }
      });
    }
  });

  // Write aggregated Berat (merged H18:I24) - keeps existing formatting since only value is set
  sheet.getRange('H' + FIRST_ROW + ':I' + LAST_ROW)
    .setValue(totalBerat.toFixed(1) + ' Kgs');

  // Write aggregated Pick Slip (merged J18:M24)
  sheet.getRange('J' + FIRST_ROW + ':M' + LAST_ROW)
    .setValue(pickSlipTokens.join(' , '));

  // Auto fill today's date into G8, format "12-Aug-26"
  var tz = SpreadsheetApp.getActiveSpreadsheet().getSpreadsheetTimeZone();
  var todayStr = Utilities.formatDate(new Date(), tz, 'dd-MMM-yy');
  sheet.getRange('G8').setValue(todayStr);

  return 'Berjaya! ' + rows.length + ' baris dimasukkan.';
}
