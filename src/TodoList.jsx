import  { useState, useEffect, useContext } from 'react';
import Swal from 'sweetalert2';
import AuthContext from './context/AuthContext';
import CountTrueItems from './CountTrueItems';
import TaskDialog from './context/TaskDialog';

const Todolist = () => {
  const [storedData, setStoredData] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const userId = Number(localStorage.getItem('userId'));
  const [category, setCategory] = useState([]);
  const storedDataSaved = localStorage.getItem('newDataSaved') === 'true';
  const [openDialog, setOpenDialog] = useState(false);
 const [selectedTask, setSelectedTask] = useState(null);
 const [selectedCategory, setSelectedCategory] = useState('');
 const [selectedCategoryId, setSelectedCategoryId] = useState('');
 const [textFieldButtonName, setTextFieldButtonName] = useState('');
 const [selectedDate, setSelectedDate] = useState(new Date());
 const [taskname, setTaskname] = useState('');
 const [taskdescription, setTaskdescription] = useState('');

  const handleOpenDialog = (taskId) => {
    const selectedTask = storedData.find(task => task.id === taskId);
    setOpenDialog(true);
    setSelectedTask(selectedTask);
    console.log("ID", taskId)
  };

  const handleCloseDialog = () => {
  //  setTextFieldButtonName("Update")
  //  setTaskname("");
   // setTaskdescription(""); This applies to the textfiled that I hide
    setOpenDialog(false);
  };


  const handleClickCategory = (categoryName, categoryId) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
  
  };

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`https://task-list-db.onrender.com/${selectedTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskname: taskname,
          taskdescription: taskdescription,
          category_id:selectedCategoryId,
          end_date:selectedDate,
          isCompleted: false,
          user_id:userId
          // Add other fields to update here as needed
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      handleCloseDialog();
      // Handle success, maybe show a success message or update UI
    } catch (error) {
      console.error('Error updating task:', error.message);
      // Handle error, maybe show an error message to the user
    }
  };
  
  



  useEffect(() => {
    if (storedData.length === 0){
  populateLeftSideList();
    }
  }, [storedData]);
  
  const populateLeftSideList = async () => {
    try {
      const response = await fetch('https://task-list-db.onrender.com/api/v1/tasklist');
      const responseData = await response.json();
      if (Array.isArray(responseData.data)) {
       
        const filteredData = responseData.data.filter(item => item.attributes.user_id === userId);

        const modifiedData = filteredData.map(item => ({
          ...item,
          isCompleted: item.attributes.isCompleted === true,
        }));


        modifiedData.forEach(item => {
          if (item.isCompleted) {
            item.attributes.taskname = <span style={{ textDecoration: 'line-through' }}>{item.attributes.taskname}</span>;
          }
        });
  
        setStoredData(modifiedData);
       
      } else {
        console.error('Invalid response from API:', responseData);
      //  alert('Failed to fetch tasks. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
     // alert('Failed to fetch tasks. Please try again later.');
    }
  };

 

  const handleCompleted = async (item) => {
  
    try {
      // Send a PATCH request to update the completed attribute of the item in the database
      await fetch(`https://task-list-db.onrender.com/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isCompleted: !item.isCompleted }),
      });

      await populateLeftSideList();
    
    } catch (error) {
      console.error('Error updating completed status:', error);
    }
  };


 

  const handleDetails = (item) => {
    const maxTitleLength = 20;
    // Truncate the item.title if it exceeds the maximum length
    const truncatedTitle = (item.attributes.taskname.length > maxTitleLength
      ? item.attributes.taskname.slice(0, maxTitleLength) + '...' // Add ellipsis if truncated
      : item.attributes.taskname);

    Swal.fire({
      title: `Title: ${truncatedTitle}`,
      html: `
        <p>Details: ${item.attributes.taskdescription}</p>
      `,
      showClass: {
        popup: 'animate__animated animate__fadeIn'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOut'
      }
    });
    console.log("ha?",item.attributes.taskname)
  };
  

  const handleDelete = (index) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this pending task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://task-list-db.onrender.com/${index.id}`, {
            method: 'DELETE'
          });
    
          if (!response.ok) {
            throw new Error('Failed to delete task');
          }
        //  populateLeftSideList();
          setStoredData(storedData.filter((t) => t.id !== index.id));
        } catch (error) {
          console.error('Error deleting task:', error.message);
          alert('Failed to delete task. Please try again later.');
        }
        Swal.fire({
          title: 'Deleted',
          text: 'The item has been deleted.',
          icon: 'success',
          confirmButtonText: 'Close',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your imaginary file is safe :)', 'info');
      }
    });
  }

  function formatDate(isoDateString, format) {
    const date = new Date(isoDateString);

    date.setDate(date.getDate() + 1);

    if (format === 'YYYY-MM-DD') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    } else if (format === 'DD-MM-YYYY') {
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    } else {
      return date.toLocaleDateString();
    }
  }

  function getCurrentDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    // Get the year, month, and day from the current date
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed, so add 1
    const day = String(currentDate.getDate()).padStart(2, '0');
  
    // Return the date in the 'YYYY-MM-DD' format
    return `${year}-${month}-${day}`;
  }

  console.log(getCurrentDate());

const completed = async() => {
  try {
    const response = await fetch('https://task-list-db.onrender.com/api/v1/tasklist');
    const responseData = await response.json();
    if (Array.isArray(responseData.data)) {
     // console.log('Tasks from API:', responseData.data);
          // Filter out items where isCompleted is not true
          const userId = Number(localStorage.getItem('userId'));
       
          const filteredData = responseData.data.filter(item => item.attributes.user_id === userId && item.attributes.isCompleted === true);

          const modifiedData = filteredData.map(item => ({
            ...item,
            isCompleted: item.attributes.isCompleted === true,
          }));
  
  
          modifiedData.forEach(item => {
            if (item.isCompleted) {
              item.attributes.taskname = <span style={{ textDecoration: 'line-through' }}>{item.attributes.taskname}</span>;
            }else{
              //I want the item to hide if not completed
            }
          });
          
          setStoredData(modifiedData);
   
    } else {
      console.error('Invalid response from API:', responseData);
      alert('Failed to fetch tasks. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    alert('Failed to fetch tasks. Please try again later.');
  }

}

const todays_task = async () => {
  try {
    const response = await fetch('https://task-list-db.onrender.com/api/v1/tasklist');
    const responseData = await response.json();
    if (Array.isArray(responseData.data)) {
     // console.log('Tasks from API:', responseData.data);
          // Filter out items where isCompleted is not true
          const userId = Number(localStorage.getItem('userId'));
       
          const filteredData = responseData.data.filter(item => item.attributes.user_id === userId && item.attributes.end_date === getCurrentDate());

          const modifiedData = filteredData.map(item => ({
            ...item,
            isCompleted: item.attributes.isCompleted === true,
          }));
  
  
          modifiedData.forEach(item => {
            if (item.isCompleted) {
              item.attributes.taskname = <span style={{ textDecoration: 'line-through' }}>{item.attributes.taskname}</span>;
            }else{
              //I want the item to hide if not completed
            }
          });
          
          setStoredData(modifiedData);
   
    } else {
      console.error('Invalid response from API:', responseData);
      alert('Failed to fetch tasks. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    alert('Failed to fetch tasks. Please try again later.');
  }
}

const total_category = async () => {
  try {
    const response = await fetch('https://task-list-db.onrender.com/api/v1/category');
    const responseData = await response.json();
    if (Array.isArray(responseData.data)) {
    //  console.log('Tasks from API:', responseData.data);

      const filteredData = responseData.data.filter(item => item.attributes.user_id === userId);

      setCategory(filteredData)
      
    } else {
      console.error('Invalid response from API:', responseData);
      alert('Failed to fetch tasks. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    alert('Failed to fetch tasks. Please try again later.');
  }
}

const show_task_from_cat = async(textToCopy) =>{
 const category_id = Number(textToCopy);
  try {
    const response = await fetch('https://task-list-db.onrender.com/api/v1/tasklist');
    const responseData = await response.json();
    if (Array.isArray(responseData.data)) {   

      const filteredData = responseData.data.filter(item => item.attributes.category_id === category_id && item.attributes.user_id === userId);

    // Boolean flag to track whether any item matches the given category ID
    let idFound = false;

    const modifiedData = filteredData.map(item => {
      const isCompleted = item.attributes.isCompleted === true;
      let taskname = item.attributes.taskname;

      if (isCompleted) {
        taskname = <span style={{ textDecoration: 'line-through' }}>{taskname}</span>;
      }

      // Check if the item's category ID matches the given category ID
      if (item.attributes.category_id === category_id) {
        idFound = true; // Set the flag to true if a match is found
       
      }
      
        return {
          ...item,
          isCompleted,
          attributes: {
            ...item.attributes,
            taskname
          }   
        };
      }
      );

       if (!idFound){
        Swal.fire({
          title: 'This category has no task yet',
          icon: 'warning',
          confirmButtonText: 'Ok'
        })
      }

       setStoredData(modifiedData);

    } else {
      console.error('Invalid response from API:', responseData);
      alert('Failed to fetch tasks. Please try again later.');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    alert('Failed to fetch tasks. Please try again later.');
  }

}



useEffect(() => {
  if (category.length === 0) {
  total_category();
  }
}, [userId]);

  return (
    
    <div>
<>
        <TaskDialog
          open={openDialog}
          handleCloseDialog={handleCloseDialog}
          selectedTask={selectedTask} // Pass fetched task data as prop
          category={category}
          handleClickCategory={handleClickCategory}
          selectedCategory={selectedCategory}
         setSelectedCategory={setSelectedCategory}
         setTextFieldButtonName={setTextFieldButtonName}
         textFieldButtonName={textFieldButtonName}
         setSelectedDate={setSelectedDate}
         handleSubmit={handleSubmit}
          setTaskname={setTaskname}
          taskname={taskname}
          taskdescription={taskdescription}
           setTaskdescription={setTaskdescription}
         />

  
         <CountTrueItems
        items={storedData} 
         completed={completed}
         todays={todays_task}
         displayCategory={category}
         clickShowCat={show_task_from_cat}
        /> 

 

{isLoggedIn ?  (
      <ul id="left-side-list">
        {storedData.map((item) => (
     
          <li key={item.id}>
            <div className="list-item-content">
              <input type="checkbox" checked={item.isCompleted} onChange={() => handleCompleted(item)} />
              
            
            <div className="text-container">
              {item.attributes.taskname}
             </div>
         <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {item.attributes.end_date === getCurrentDate() ? (
            <img src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaG1rdDFsaGExeXJrZ3Z1cmF1Z25hNmN4cGVnZXc5YWY2cmlhM3RyNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C1vogr3ZrH3nmfaADy/giphy.gif" alt="ringing bell" width="50" height="50"/>
  
        ) : (
          <span></span>
          )}
              {!item.isCompleted ? (
            <button className="details-button" onClick={() => handleOpenDialog(item.id)}>Update</button>
          ) : (
            <button className="details-button" onClick={() => handleUpdate(item)}>Details</button>
          )}
              <span className="date-span">Deadline:{formatDate(item.attributes.end_date)}</span>
              
              <i className="fa-solid fa-trash delete-icon" onClick={() => handleDelete(item)} />
            </div>
          </li>

        ))}
      </ul>
      
    ) : (
      <span></span>
    )}
      
    </>  
    </div>
  );
};



export default Todolist;
