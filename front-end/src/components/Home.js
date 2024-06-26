import React, { useState, useEffect } from 'react';
import bg from "./../images/bg.png";


const titles = ["Software Engineer", "Developer"]; 

const Home = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setTitleIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 4000); // 每1000毫秒切換一次
    return () => clearInterval(intervalId); // 清除計時器
  }, []);

  return (
    <>
      <div className="text-center">
        <div className="line-container">
          <h6 className="line">hire me</h6>
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img 
            src={bg} 
            alt="project birds"
            style={{ maxWidth: '100%', maxHeight: '50%' }}
          />
          <div className="animation" style={{ position: 'absolute', top: '60%', left: '30%', transform: 'translate(-50%, -50%)' }}>
            <h2 style={{ display: 'inline' }}>I'M A {titles[titleIndex]}</h2>
            <h5>"HELLO WORLD"</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
