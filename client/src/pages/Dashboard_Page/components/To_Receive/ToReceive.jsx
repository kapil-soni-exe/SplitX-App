import React from 'react'
import { getReceiveList } from '../../../../utils/calculation/toreceive'
import "./ToReceive.css"
import { RiArrowRightSLine } from '@remixicon/react'


function ToReceive({groups,currentUserId}) {
  const ReceiveList= getReceiveList(groups,currentUserId)
  const total = ReceiveList.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  return (
    <div className="receive-card">
      <div className="receive-header">
          <h3>You Will Receive</h3>
        <p>In this group</p>
      </div>

      <div className="receive-body">
        {ReceiveList.length ===0 ? (
          <div className='receive-empty'>
            🎉 Nothing to collect here!
          </div>
        ):(
          ReceiveList.map((person)=>(
            <div
            key={person.userId}
            className='receive-row'
            >
              <div className="receive-left">
                <div className="receive-avatar">
                  {person.name[0]}
                </div>
                <span className='receive-name'> {person.name}</span>
              </div>
              <div className="receive-right">
                <span className="receive-amount">
                   ₹{person.amount}
                </span>
                <RiArrowRightSLine size={20} />
              </div>
            </div>
          ))
        )}
      </div>
      {ReceiveList.length > 0 && (
        <div className="receive-footer">
          <div className="receive-total">
            <span>Total to Receive</span>
            <strong>₹{total}</strong>
          </div>

          <button className="receive-btn">
            Collect
          </button>
        </div>
      )}
    </div>
  )
}

export default ToReceive