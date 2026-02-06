

export function activityFormatter(expense, group, currentUserId){

    const isOutgoing = expense.paidBy === currentUserId
    const payer =group.members.find((m)=> m.id===expense.paidBy)
    let name = isOutgoing?"You" : payer?.name
    
    return `${name} added ₹${expense.amount} for ${expense.title}`

}