import { useState, useContext, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import { InputAdornment, selectClasses } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Grid } from '@mui/material';
import Register from '../Register';
import  useData from '../context/useData';
import FloatingActionButton from '../context/FloatingActionButton';
import TaskDialog from '../context/TaskDialog';


function Createtask() {
  const [taskname, setTaskname] = useState('');
  const [taskdescription, setTaskdescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [textFieldButtonName, setTextFieldButtonName] = useState('Create');
  const userId = Number(localStorage.getItem('userId'));
  const [show_Reg_Form, set_show_Reg_Form] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);
  const { saveDataToApi } = useData();
  const [textFieldButtonAction, setTextFieldButtonAction] = useState('');

 
  const proceed_to_update_category = async () =>{
    try {
      const response = await fetch(`https://task-list-db.onrender.com/api/v1/category/${selectedCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: selectedCategory }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update category');
      }
      setSelectedCategory("");
      setTextFieldButtonName('Create');
      await populateCategory();
      console.log('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error.message);
      alert('Failed to update category. Please try again later.');
    }
  }

  const create_new_category = async () => {

    const userId = localStorage.getItem('userId');

    const response = await fetch('https://task-list-db.onrender.com/api/v1/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: selectedCategory, user_id: userId }),
    });

  }

  const populateCategory = async () => {
    try {
      const response = await fetch('https://task-list-db.onrender.com/api/v1/category');
      const responseData = await response.json();
      if (Array.isArray(responseData.data)) {
       // console.log('Tasks from API:', responseData.data);

        const filteredData = responseData.data.filter(item => item.attributes.user_id === userId);

        setCategory(filteredData);
      } else {
        console.error('Invalid response from API:', responseData);
        alert('Failed to fetch tasks. Please try again later.');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error.message);
      alert('Failed to fetch tasks. Please try again later.');
    }
  };
  
  const proceed_to_create_category = async () =>{
    const isCategoryUnique = !category.some(category => category.attributes.name === selectedCategory);
  
    if (isCategoryUnique) {
     await create_new_category();
  
     await populateCategory();
  
    }
  }

 
  

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedCategory("");
    setTaskdescription("");
   // setSelectedDate("");
    setTaskname("");
    setTextFieldButtonName("Create")
    setOpen(false);
  };

 

  function notLoggedIn(){
    Swal.fire({
      title: "You are not logged in",
      text: "If you have not registered yet, please click the register button below",
      icon: "info",
      showCancelButton: false,
      confirmButtonText: "Register",
      
  
    }).then((result) => {
      if (result.isConfirmed) {
        set_show_Reg_Form((prevState) => {
          const newState = !prevState;
          console.log("show_Reg_Form:", newState); // Log the new state
          setTimeout(() => {
            // Revert show_Reg_Form back to its previous state after 1 second
            set_show_Reg_Form(prevState);
          }, 1000);
          return newState;
        });
    
      }
    },);
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await saveDataToApi({ taskname, taskdescription, category_id:selectedCategoryId, end_date:selectedDate });
      handleCloseDialog();
     // window.location.reload();
    } catch (error) {
     console.error('Error saving data:', error.message);
     Swal.alert('Failed to save data. Please try again later.');
    }
  };

 

  useEffect(() => {
    populateCategory();
  }, []);
  
  const handleClickCategory = (categoryName, categoryId) => {
    setSelectedCategory(categoryName);
    setSelectedCategoryId(categoryId);
  
  };

  const delete_category = async () =>{
    setOpen(false);
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this category?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      cancelButtonText: 'No, cancel',
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://task-list-db.onrender.com/api/v1/category/${selectedCategoryId}`, {
            method: 'DELETE'
          });

          await populateCategory();
    
          if (!response.ok) {
            throw new Error('Failed to delete the category');
          }
        //  populateLeftSideList();
      //    setCategory(category.filter((t) => t.id !== index.id));
        } catch (error) {
          console.error('Error deleting category:', error.message);
          alert('Failed to delete category. Please try again later.');
        }
        Swal.fire({
          title: 'Deleted',
          text: 'The category has been deleted.',
          icon: 'success',
          confirmButtonText: 'Close',
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Cancel pa more :)', 'info');
      }
    });
  }

  
  return (
    <>
    
    {show_Reg_Form && <Register />}

    <FloatingActionButton handleOpenDialog={handleOpenDialog} notLoggedIn={notLoggedIn} />
   
    <TaskDialog
        open={open}
        handleCloseDialog={handleCloseDialog}
        taskname={taskname}
        setTaskname={setTaskname}
        taskdescription={taskdescription}
        setTaskdescription={setTaskdescription}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        textFieldButtonName={textFieldButtonName}
        setTextFieldButtonName={setTextFieldButtonName}
        handleSubmit={handleSubmit}
        proceedToUpdateCategory={proceed_to_update_category}
        proceedToCreateCategory={proceed_to_create_category}
        category={category}
        handleClickCategory={handleClickCategory}
        deleteCategory={delete_category}
      />
      
    </>
  );
}

export default Createtask;
