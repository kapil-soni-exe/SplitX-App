import { sortByDate,formatTime  } from "./dateHelper"
import { activityFormatter } from "./activityFormatter";


export function getLastExpense(group){
  if (!group.expenses || group.expenses.length === 0) return null;

    const copy=[...group.expenses]
    
  sortByDate(copy)
  return copy[copy.length-1]
}

export function getLastActivity(group,userId){
  const lastExpense=getLastExpense(group)
  
  if(!lastExpense){
    return ""
  }
  
  const str = activityFormatter(lastExpense,group,userId)

  return str

}

export function getLastActivityTime(group){

const lastExpense=getLastExpense(group)
  
  if(!lastExpense){
    return ""
  }
  const date= lastExpense.createdAt

  
  const time=formatTime(date)

  return ` ${time}`


}
