taskkill /f /im explorer.exe
del /a %localappdata%\IconCache.db
del /a %localappdata%\Microsoft\Windows\Explorer\iconcache*
start explorer.exe

Suggestion for Small Usability Enhancement – List of Values Input


Hi JDE Team,

I would like to suggest a small usability enhancement for your consideration.

Currently, the List of Values (LOV) input only accepts a single value at a time. It would be helpful if the LOV field could also accept multiple values pasted as a single string (for example, values separated by commas, spaces, or new lines) and automatically interpret them as individual entries.

This would allow users to paste a list directly into the LOV input instead of entering each value one by one. The underlying search logic and business rules would remain unchanged—the only difference would be how the input is interpreted before processing.

For users who frequently work with multiple Pick Slip numbers that are not in sequence, this could save a considerable amount of time and reduce repetitive manual input.

For example, the current workflow is:

Copy Pick Slip 1 → Paste into LOV → Press Enter

Copy Pick Slip 2 → Paste into LOV → Press Enter

Repeat until all Pick Slip numbers have been entered.

Instead, it would be much more efficient if users could simply paste a single string such as:

"0000001 0000004 0000099" or
"0000001,0000004,0000099" or
"0000001, 0000004, 0000099".

The system would then interpret these as three individual Pick Slip numbers and proceed with the search accordingly.

I hope this clearly explains my suggestion. I understand there may be technical or design considerations, but I thought this would be a worthwhile quality-of-life enhancement for users who regularly process multiple shipments.

Thank you for your time and consideration.
