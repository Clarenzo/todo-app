# Manual Test Plan

Run the app with `npm run dev`. Use a private/incognito window if you want to test a fresh task list without clearing your existing saved tasks.

| Area | Action | Expected result |
| Create | Add a task with only a title | It appears with medium priority | Passed |
| Validation | Submit an empty or spaces-only title | No task is created; an error appears | Passed |
| Details | Add a description, due date and high priority | All details appear on the task | Passed |
| Edit | Change and save every task detail | The new value appear | Passed |
| Cancel | Change details, then select Cancel | The original values remain | Passed |
| Complete | Check and uncheck a task | Its appearance and completed count update | Passed |
| Delete | Delete a task | It disappears and the count updates | Passed |
| Status Filter | Choose Active, then Completed | Each view shows only matching tasks | Passed |
| Priority Filter | Select a priority alongside a status | Both filters apply together | Passed |
| Filter safety | Reset filters to All | Previously hidden tasks reappear | Passed |
| Reorder | Use Up/Down with both filters set to All | Tasks move one place at a time | Passed |
| Drag | Drag a handle onto another task on desktop | The task moves to the new position | Passed |
| Filtered reorder | Activate either filter | Reorder controls are unavailable | Passed |
| Persistence | Refresh after editing, deleting, completing and reordering | Remaining tasks and their order persist | Passed |
| Keyboard | Use Tab and the arrow controls | Controls can be reached and activated | Passed |
| Narrow screen | Check the app at about 320px and 390px wide | Content remains readable; buttons do not cause horizontal scrolling | Passed |


Filters resetting to All on refresh is expected: we save tasks, not filter selections.

Finally, run `npm run build` and `npm run lint`. Record any failed case and fix it before the final milestone commit.