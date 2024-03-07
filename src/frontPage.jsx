import './App.css'
import {useState,useEffect} from 'react';
import { format } from 'date-fns';

const Index = () => {

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  
  return (
    <>
    <div>   
        <div className="top_left">
        <h1>{format(currentTime, 'HH:mm:ss')}</h1>
          
          </div>
         
      </div>
      <div className="setAndqoute">
              {/* <div id="add-icon" className="clickable dropup-menu">
                  <span><i className="fa-solid fa-gear"></i></span>
                  <div className="dropdown-content">
                      <a href="#" id="add-todo">Add To Do</a>
                      <a href="#" id="add-quotes"> Add Quotes</a>
                      <a href="#" id="edit-quotes"> Edit Quotes</a>
                  </div>
              </div> */}
              <div className="quote">
                  <h5 id="content"></h5>
                  <h6 id="author"></h6>
              </div>
              <div className="clickable"></div>
          </div>
          </>
  );
}

export default Index;
