import React, { useState, useRef, useContext } from 'react';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Todolist from './TodoList';
import AuthContext from './context/AuthContext';

const CountTrueItems = ({ items, completed, todays, displayCategory, clickShowCat }) => {
  // Get the current date and format it as "YYYY-MM-DD"
  const { isLoggedIn } = useContext(AuthContext);
  const currentDate = new Date().toISOString().split('T')[0];
  const [buttonColor, setButtonColor] = useState('primary');
  const [anchorEl, setAnchorEl] = useState(null);
  const [category_name, set_category_name] = useState('Category');
  let no_task_then_hide = useRef(true);

  const handleColorButton = () => {
    setButtonColor('secondary');
    completed();
  };

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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (categoryID , categoryName) => {
    handleMenuClose();
   clickShowCat(categoryID);
   set_category_name(categoryName)
   return <Todolist textToCopy={categoryID} />;
  };

 
console.log("testing", currentDate)
  // Filter items created today
  const itemsEndToday = items.filter(
    (item) => item.attributes.end_date === getCurrentDate()
  );

  const itemsCreatedToday = items.filter(
    (item) => item.attributes.end_date === currentDate
  );

  // Count the number of items marked as true
  const trueItemsCount = items.filter((item) => item.isCompleted).length;

  if (itemsCreatedToday) {
    no_task_then_hide = false
  }

  const trueItemsCreatedTodayCount = itemsEndToday.filter(
    (item) => item.isCompleted
  ).length;

  const count_category = displayCategory.filter((item) => item.attributes.user_id).length;



  return (
    <>
    <span></span>
    { isLoggedIn ? (
      <><Badge badgeContent={trueItemsCount} color="success">
          <Button
            startIcon={<CheckCircleIcon />}
            variant="contained"
            color={buttonColor}
            onClick={handleColorButton}
            disabled={trueItemsCount === 0}
          >
            Completed
          </Button>
        </Badge>
        
        <Badge
          badgeContent={`${trueItemsCreatedTodayCount} out of ${itemsEndToday.length} is completed`}
          color="warning"
        >
            <Button
              startIcon={<CheckCircleIcon />}
              variant="contained"
              color="primary"
              onClick={todays}
              disabled={itemsEndToday.length === 0}
            >
              Today
            </Button>
          </Badge><Badge badgeContent={count_category} color="success">
            <Button
              startIcon={<CheckCircleIcon />}
              variant="contained"
              color="primary"
              onClick={handleMenuOpen}
              disabled={displayCategory.length === 0}
            >
              {category_name}
            </Button>
          </Badge><Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            {displayCategory.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => handleMenuItemClick(item.id, item.attributes.name)}
              >
                {item.attributes.name}
              </MenuItem>
            ))}
          </Menu></>
      ) : (
        <h2 id="focus">Click on the + button to add task</h2>
        )}

    </>
  );
};

export default CountTrueItems;
