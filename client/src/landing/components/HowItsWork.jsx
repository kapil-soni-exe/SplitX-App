import React from 'react'

function HowItsWork() {
  return (
    <main className="how" id='how-it-works'>
      <div className="headings">
        <h1 className='hows-head'>How It Works</h1>
        <h3 className='hows-subhead'>Split expenses in three simple steps.</h3>
      </div>

      <div className="steps-cards">
          <div className="card">
            <h2 className='card-heading'>Step 01</h2>
            <h1 className="card-title">Create Group</h1>
            <p className='card-content'>Start a group for friends,trips,etc.</p>
          </div>
          <div className="card">
            <h2 className='card-heading'>Step 02</h2>
            <h1 className="card-title">Add Expenses</h1>
            <p className='card-content'>Add who paid and split fairly</p>
          </div>
          <div className="card">
            <h2 className='card-heading'>Step 03</h2>
            <h1 className="card-title"> Settle Up </h1>
            <p className='card-content'>View balances and settle without confusion.</p>
          </div>
      </div>
    </main>
  )
}

export default HowItsWork