import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

function HowItsWork() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <main className="how-awwwards" id='how-it-works' ref={containerRef}>
      <div className="headings">
        <h1 className='hows-head'>How It Works</h1>
        <h3 className='hows-subhead'>Three simple steps to financial peace.</h3>
      </div>

      <div className="sticky-cards-container">
        {/* Card 1 */}
        <div className="sticky-card" style={{ top: '80px' }}>
          <div className="sticky-card-inner">
            <h2 className='massive-number'>01</h2>
            <div className='card-content-block'>
              <h1 className="card-title">Create Group</h1>
              <p className='card-content'>Start a group for friends, trips, or your home. Add members in seconds.</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="sticky-card" style={{ top: '120px' }}>
          <div className="sticky-card-inner">
            <h2 className='massive-number'>02</h2>
            <div className='card-content-block'>
              <h1 className="card-title">Add Expenses</h1>
              <p className='card-content'>Log who paid and how it should be split. We handle the complex math automatically.</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="sticky-card" style={{ top: '160px' }}>
          <div className="sticky-card-inner">
            <h2 className='massive-number'>03</h2>
            <div className='card-content-block'>
              <h1 className="card-title">Settle Up</h1>
              <p className='card-content'>View simplified balances and settle debts with a single click, without the confusion.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HowItsWork;