import React, { useContext } from 'react';
import { Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AuthContext from './AuthContext';

function FloatingActionButton({ handleOpenDialog, notLoggedIn }) {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        '& > :not(style)': { m: 1 },
      }}
    >
      {isLoggedIn ? (
        <Fab color="primary" aria-label="add" onClick={handleOpenDialog}>
          <AddIcon />
        </Fab>
      ) : (
        <Fab color="primary" aria-label="add" onClick={notLoggedIn}>
          <AddIcon />
        </Fab>
      )}
    </Box>
  );
}

export default FloatingActionButton;
