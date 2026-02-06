export function getTotalSpent(group){
  if(!group||!group.expenses) return 0

  return group.expenses.reduce((sum,expense)=>{
     return sum+expense.amount
  },0)
}

// 
export function getUserPaid(group,userId){
  if(!group||!group.expenses) return 0
      
  return group.expenses.reduce((sum,expense)=>{
    if(expense.paidBy===userId){
     return sum+expense.amount
    }
    return sum
  },0)
}

export function getUserShare(group, userId) {
  if (!group || !group.expenses) return 0;

  return group.expenses.reduce((sum, expense) => {
    if(expense.splitBetween.includes(userId)){
      const share = expense.amount/expense.splitBetween.length
      return sum+share
    }
    return sum
  }, 0);
}
