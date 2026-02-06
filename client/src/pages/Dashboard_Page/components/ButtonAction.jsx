import React, { useState } from 'react'
import Button from '../../../components/comman/Button'
import "./Buttonaction.css"
import { useCreateGroup } from '../../../hooks/useCreateGroup'
import Model from "../../../components/comman/Model"
import InviteLink from "../../Group_Page/components/GroupList/InviteLink"
import CreateGroup from '../../Group_Page/components/GroupList/CreateGroup'


function ButtonAction() {

  const {create} = useCreateGroup()
const [open, setOpen] = useState(false);
const [createdGroup, setCreatedGroup] = useState(null);
const [inviteLink, setInviteLink] = useState(null);
  const currentUserId = "698057b1a4d18bd0b4b9e8d0";


const handleCreateGroup = async (name) => {
    try {
      const { group, inviteLink } = await create(name, currentUserId);

      setCreatedGroup(group);
      setInviteLink(inviteLink);

      // later: refresh groups list
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="btn-action">
     <Button text='Add Expenses' className='btn-dash'/>

     <Button text='Create Group' className='btn-dash' onClick={()=>setOpen(true)} />
      
     <Model isOpen={open} onClose={() => {
            setOpen(false);
            setCreatedGroup(null);
            setInviteLink(null);
          }}>{!createdGroup?(
            <CreateGroup onCreate={handleCreateGroup}/>
          ):(
           <InviteLink inviteLink={inviteLink}/>
          )}
    </Model>
     <Button text='Setteld'className='btn-dash' />
    </div>
  )
}

export default ButtonAction