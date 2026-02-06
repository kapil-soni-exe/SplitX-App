import React from 'react'

function Features() {
  return (
    <section className="features" id='feature'>
      <div className="features-headings">
        <h1 className="features-title">Features</h1>
        <p className="features-subtitle">
          Everything you need to manage shared expenses with ease.
        </p>
      </div>

      <div className="timeline">
        {/* Item 1 */}
        <div className="timeline-item">
          <div className="timeline-marker"></div>

          <div className="timeline-content">
            <h3>Smart group splits</h3>
            <p>
              Automatically split expenses fairly across everyone in the group.
            </p>
          </div>
        </div>

        {/* Item 2 */}
        <div className="timeline-item">
          <div className="timeline-marker"></div>

          <div className="timeline-content">
            <h3>Real-time balances</h3>
            <p>
              Always know who owes whom with instant balance updates.
            </p>
          </div>
        </div>

        {/* Item 3 */}
        <div className="timeline-item">
          <div className="timeline-marker"></div>

          <div className="timeline-content">
            <h3>Clear settlements</h3>
            <p>
              Settle up without awkward money conversations.
            </p>
          </div>
        </div>

        {/* Item 4 */}
        <div className="timeline-item">
          <div className="timeline-marker"></div>

          <div className="timeline-content">
            <h3>Expense history</h3>
            <p>
              View and track all past expenses anytime.
            </p>
          </div>
        </div>

        {/* Item 5 */}
        <div className="timeline-item">
          <div className="timeline-marker"></div>

          <div className="timeline-content">
            <h3>Notifications</h3>
            <p>
              Stay informed whenever new expenses are added.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features