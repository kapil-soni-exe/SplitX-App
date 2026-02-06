export function isSameDay(dateA,dateB){
  const d1= new Date(dateA);
  const d2= new Date(dateB)

  return(
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth()=== d2.getMonth()&&
    d1.getDate()=== d2.getDate()
  )

}

export function getDayLabel(dateStr){
    const date = new Date(dateStr);
    
    const today = new Date();
    const yesterday = new Date(today);
  yesterday.setDate(today.getDate()-1);

  if(isSameDay(date,today)){
    return "Today"
  } else if(isSameDay(date,yesterday)){
    return "Yesterday"
  } else{
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    return days[date.getDay()];
  }

}

export function formatTime(dateStr){
    const date = new Date(dateStr)

    const hours = date.getHours()
    
   const ampm = hours >= 12 ? "PM" : "AM";

    const displayHours= hours%12 || 12 

   const minutes= String(date.getMinutes()).padStart(2,"0")

    
    return `${displayHours}:${minutes} ${ampm}`

}

export function sortByDate(items){
    const copy = [...items];

    copy.sort((a,b)=>{
        const TimeA =new Date(a.createdAt).getTime()
        const TimeB =new Date(b.createdAt).getTime()
       return TimeA - TimeB
    })

    return copy
}