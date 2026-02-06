
import Input from '../../../../components/comman/Input'


function GroupSearch({value,onChange}) {


  return (
    <div><Input type='text' placeholder='Search' className='group-search'
    value={value}  onChange={onChange}
    /></div>
  )
}

export default GroupSearch