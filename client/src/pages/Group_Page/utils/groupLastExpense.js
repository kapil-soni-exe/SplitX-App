import { formatTime } from "./dateHelper";
import { activityFormatter } from "./activityFormatter";



export function getLastActivity(group, userId) {
 

  const lastExpense = group?.lastExpense;

  if (!lastExpense) return "";

  return activityFormatter(lastExpense, userId);
}

export function getLastActivityTime(group) {
  const lastExpense = group?.lastExpense;

  

  if (!lastExpense) return "";

  return formatTime(lastExpense.createdAt);
}