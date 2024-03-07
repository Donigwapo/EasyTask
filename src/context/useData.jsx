import { useState } from "react";
import Swal from "sweetalert2";

function useData() {
 const [newDataSaved, setNewDataSaved] = useState(false);

  const saveDataToApi = async (data) => {
    try {
        const userId = localStorage.getItem('userId');
  
        const response = await fetch('http://localhost:3000/api/v1/tasklist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...data, isCompleted: false, user_id:userId }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit task');
          
        }

        setNewDataSaved(true);
        localStorage.setItem('newDataSaved', true); 
     
      } catch (error) {
        // console.error('Error submitting task:', error.message);
        // alert('Failed to submit task. Please try again later.');
      }
      
      
  };
 
  return {
    newDataSaved,
    saveDataToApi,
  };
}

export default useData;