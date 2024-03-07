import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import { InputAdornment } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function TaskDialog({
  open,
  handleCloseDialog,
  taskname,
  setTaskname,
  taskdescription,
  setTaskdescription,
  selectedDate,
  setSelectedDate,
  selectedCategory,
  setSelectedCategory,
  textFieldButtonName,
  setTextFieldButtonName,
  handleSubmit,
  proceedToUpdateCategory,
  proceedToCreateCategory,
  category,
  handleClickCategory,
  deleteCategory,
  selectedTask,
}) {
  const [taskDescription, setTaskDescription] = useState('');
  const [taskName, setTaskName] = useState('');

  useEffect((e) => {
    if (selectedTask) {
       setTaskDescription(selectedTask.attributes.taskdescription || '');
      setTaskName(selectedTask.attributes.taskname || '');
      setTaskname(selectedTask.attributes.taskname);
      setTaskdescription(selectedTask.attributes.taskdescription);
    }
  }, [selectedTask]);


  const handleDescriptionChange = (e) => {
    if (selectedTask) {
      setTaskdescription(e.target.value);
      setTaskDescription(e.target.value);
    } else {
      // Update task description state if no selected task
      setTaskdescription(e.target.value)
    }
  };

  const handleTaskNameChange = (e) => {
    if (selectedTask) {
      setTaskname(e.target.value);
      setTaskName(e.target.value);
    } else {
      
      setTaskname(e.target.value);
    }
  };


  const handleValueChange = () => {
    if (selectedTask) {
    return taskName;
    } else {
      
    return taskname;
    }
  };

  const handleValueChangeForDescription = () => {
    if (selectedTask) {
    return taskDescription;
    } else {
      
    return taskdescription;
    }
  };

  return (

    <Dialog open={open} onClose={handleCloseDialog}>
     <DialogTitle>{selectedTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent style={{ display: 'flex', flexDirection: 'column' }}>
      
     
               <TextField
               label="Task Name"
               value={handleValueChange()}
               onChange={handleTaskNameChange}
               style={{ marginBottom: 16, width: 300 }}
             />
             <TextField
               label="Task Name"
               value={taskname}
               onChange={(e) => setTaskname(e.target.value)}
               style={{ marginBottom: 16, width: 300, display:'none' }}
             />

              <TextField
               label="Description"
                value={taskdescription}
                onChange={(e) => setTaskdescription(e.target.value)}
               style={{ marginBottom: 16, width: 300, display:'none' }}
             />
           

               <TextField
               label="Description"
                value={handleValueChangeForDescription()}
               onChange={handleDescriptionChange}
               style={{ marginBottom: 16, width: 300 }}
             />

            
            
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Target Date"
            onChange={(date) => setSelectedDate(date)}
            textField={(props) => (
              <TextField
                {...props}
                adapter={dayjs}
                adapterProp={{
                  locale: 'en-SG',
                  timezone: 'Asia/Singapore'
                }}
              />
            )}
          />
        </LocalizationProvider>

   
        <TextField
          label="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button variant="contained" color="primary" onClick={() => {
                  if (textFieldButtonName === 'Update') {
                    proceedToUpdateCategory();
                  } else {
                    proceedToCreateCategory();
                  }
                }}>
                  {textFieldButtonName}
                </Button>
              </InputAdornment>
            ),
          }}
        />
      

        {category && category.map((categories) => (
          <Button
            key={categories.id}
            onClick={() => {

              if (!selectedTask) {
                setTextFieldButtonName('Update');
            
              }
              
              handleClickCategory(categories.attributes.name, categories.id);
            }}
            style={{ backgroundColor: 'skyblue' }}
          >
            {categories.attributes.name}
            <IconButton size="small" onClick={() => {
              deleteCategory(categories.id);
            }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Button>
        ))}

      </DialogContent>
      <DialogActions>
      <Button onClick={handleSubmit} color="primary">
        {selectedTask ? 'Update' : 'Create'}
      </Button>
        <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TaskDialog;
