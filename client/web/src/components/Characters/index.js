/**
 * src/components/Characters/index.jsx
 * create and display characters
 *
 * created by Lynchee on 7/16/23
 */

// Characters
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import GroupsIcon from '@mui/icons-material/Groups';
import './style.css';

const Characters = ({
  isMobile,
  characterGroups,
  selectedCharacter,
  setSelectedCharacter,
  isPlaying,
  characterConfirmed,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openLibraryDialog, setOpenLibraryDialog] = useState(false);
  const [pressedCharacterId, setPressedCharacterId] = useState(null);

  const handleCharacterSelection = character => {
    setSelectedCharacter(character);
    setPressedCharacterId(character.character_id); // Set the ID of the pressed character
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenLibraryDialog = () => {
    setOpenLibraryDialog(true);
  };

  const handleCloseLibraryDialog = () => {
    setOpenLibraryDialog(false);
  };

  return (
    <Grid
      container
      spacing={2}
      sx={{ marginBottom: 5 }}
      className='main-container'
    >
      {characterGroups.map(
        (character, index) =>
          ((!characterConfirmed && character.source === 'default') ||
            (selectedCharacter &&
              character.character_id === selectedCharacter.character_id)) && (
            <Grid item xs={isMobile ? 12 : 6} key={index}>
              <Button
                variant='outlined'
                onClick={() => handleCharacterSelection(character)}
                sx={{
                  display: 'flex', // Using flexbox layout
                  alignItems: 'center', // Align items to the start (left)
                  justifyContent: 'flex-start', // Align content to the start (left)
                  width: '100%',
                  position: 'relative', // Needed for pseudo-elements
                  backgroundColor: 'black',
                  color: 'white',
                  fontFamily: 'Courier New, Courier, monospace',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    boxShadow: 'inset 1px -1px 0px rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px', // Match your button's border radius
                    pointerEvents: 'none', // Ignore this layer for mouse events
                  },
                  boxShadow:
                    pressedCharacterId === character.character_id
                      ? 'inset 0px 4px 4px rgba(0, 0, 0, 0.25), 4px 4px 5px 0 rgba(0, 0, 0, 0.5)' // Both shadows coexisting
                      : '4px 4px 5px 0 rgba(0, 0, 0, 0.5)', // Drop shadow for 3D effect
                  transform:
                    pressedCharacterId === character.character_id
                      ? 'translate(2px, 2px)'
                      : 'none', // Keep the button pressed
                  borderColor:
                    pressedCharacterId === character.character_id
                      ? 'white'
                      : 'black',
                  '&:hover': {
                    backgroundColor: 'black', // Default hover background color
                    boxShadow: '3px 3px 4px 0 rgba(0,0,0,0.4)', // Lighter shadow on hover
                    borderColor:
                      pressedCharacterId === character.character_id
                        ? 'white'
                        : 'black', // Conditional border color on hover
                  },
                  textTransform: 'none',
                  transition: 'transform 0.1s, box-shadow 0.1s', // Smooth transition for pressing effect
                }}
              >
                <Avatar
                  alt={character.name}
                  src={character.image_url}
                  sx={{ marginRight: 1 }}
                />
                <Typography
                  variant='body1'
                  sx={{
                    color: 'white',
                    fontFamily: 'Courier New, Courier, monospace',
                  }}
                >
                  {character.name.replace(/([a-z])([A-Z])/g, '$1 $2')}
                </Typography>
              </Button>
            </Grid>
          )
      )}
      {/*<Grid item xs={isMobile ? 12 : 6}>*/}
      {/*  <Button*/}
      {/*    variant='outlined'*/}
      {/*    onClick={handleOpenDialog}*/}
      {/*    sx={{*/}
      {/*      width: '100%',*/}
      {/*      backgroundColor: '#1B2134',*/}
      {/*      borderColor: '#1B2134',*/}
      {/*      '&:hover': {*/}
      {/*        backgroundColor: '#35394A',*/}
      {/*        borderColor: '#617CC2',*/}
      {/*      },*/}
      {/*      display: 'flex',*/}
      {/*      justifyContent: 'left',*/}
      {/*      textTransform: 'none',*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Avatar sx={{ backgroundColor: 'transparent' }}>*/}
      {/*      <GroupsIcon sx={{ color: 'white' }} />*/}
      {/*    </Avatar>*/}

      {/*    <Typography*/}
      {/*      variant='body1'*/}
      {/*      sx={{*/}
      {/*        color: 'white',*/}
      {/*        fontFamily: 'Prompt, sans-serif',*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      Select from community*/}
      {/*    </Typography>*/}
      {/*  </Button>*/}
      {/*</Grid>*/}

      {/*<Grid item xs={isMobile ? 12 : 6}>*/}
      {/*  <Button*/}
      {/*    variant='outlined'*/}
      {/*    onClick={handleOpenLibraryDialog}*/}
      {/*    sx={{*/}
      {/*      width: '100%',*/}
      {/*      backgroundColor: '#1B2134',*/}
      {/*      borderColor: '#1B2134',*/}
      {/*      '&:hover': {*/}
      {/*        backgroundColor: '#35394A',*/}
      {/*        borderColor: '#617CC2',*/}
      {/*      },*/}
      {/*      display: 'flex',*/}
      {/*      justifyContent: 'left',*/}
      {/*      textTransform: 'none',*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Avatar sx={{ backgroundColor: 'transparent' }}>*/}
      {/*      <GroupsIcon sx={{ color: 'white' }} />*/}
      {/*    </Avatar>*/}

      {/*    <Typography*/}
      {/*      variant='body1'*/}
      {/*      sx={{*/}
      {/*        color: 'white',*/}
      {/*        fontFamily: 'Prompt, sans-serif',*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      Select from your library*/}
      {/*    </Typography>*/}
      {/*  </Button>*/}
      {/*</Grid>*/}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby='dialog-title'
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#050E2E',
            color: 'white',
            borderColor: '#3E496D',
            borderStyle: 'solid',
          },
        }}
      >
        <DialogTitle id='dialog-title'>
          {' '}
          Select partner from RealChar community{' '}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {characterGroups.map(character => {
              return character.source === 'community' &&
                !character.is_author ? (
                <Grid item xs={isMobile ? 12 : 6}>
                  <Button
                    variant='outlined'
                    onClick={() => handleCharacterSelection(character)}
                    sx={{
                      width: '100%',
                      position: 'relative', // Needed for pseudo-elements
                      backgroundColor: 'black',
                      color: 'white',
                      fontFamily: 'Courier New, Courier, monospace',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        boxShadow:
                          'inset 1px -1px 0px rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px', // Match your button's border radius
                        pointerEvents: 'none', // Ignore this layer for mouse events
                      },
                      boxShadow:
                        pressedCharacterId === character.character_id
                          ? 'inset 0px 4px 4px rgba(0, 0, 0, 0.25), 4px 4px 5px 0 rgba(0, 0, 0, 0.5)' // Both shadows coexisting
                          : '4px 4px 5px 0 rgba(0, 0, 0, 0.5)', // Drop shadow for 3D effect
                      transform:
                        pressedCharacterId === character.character_id
                          ? 'translate(2px, 2px)'
                          : 'none', // Keep the button pressed
                      borderColor:
                        pressedCharacterId === character.character_id
                          ? 'white'
                          : 'black',
                      '&:hover': {
                        backgroundColor: 'black', // Default hover background color
                        boxShadow: '3px 3px 4px 0 rgba(0,0,0,0.4)', // Lighter shadow on hover
                        borderColor:
                          pressedCharacterId === character.character_id
                            ? 'white'
                            : 'black', // Conditional border color on hover
                      },
                      textTransform: 'none',
                      transition: 'transform 0.1s, box-shadow 0.1s', // Smooth transition for pressing effect
                    }}
                  >
                    <Avatar
                      alt={character.name}
                      src={character.image_url}
                      sx={{ marginRight: 1 }}
                    />
                    <div style={{ display: 'block', textAlign: 'left' }}>
                      <Typography
                        variant='body1'
                        sx={{
                          color: 'white',
                          fontFamily: 'Courier New, Courier, monospace',
                        }}
                      >
                        {character.name}
                      </Typography>
                      <Typography
                        variant='body1'
                        sx={{
                          color: '#BEC5D9',
                          fontFamily: 'Courier New, Courier, monospace',
                          fontStyle: 'italic',
                        }}
                      >
                        @{character.author_name}
                      </Typography>
                    </div>
                  </Button>
                </Grid>
              ) : null;
            })}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            marginBottom: 2,
            marginLeft: 2,
            marginRight: 2,
          }}
        >
          <Button
            fullWidth
            variant='contained'
            onClick={handleCloseDialog}
            sx={{ color: 'white', textTransform: 'none' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openLibraryDialog}
        onClose={handleCloseLibraryDialog}
        aria-labelledby='dialog-title'
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: '#050E2E',
            color: 'white',
            borderColor: '#3E496D',
            borderStyle: 'solid',
          },
        }}
      >
        <DialogTitle id='dialog-title'>
          {' '}
          Select partner from your library{' '}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {characterGroups.map(character => {
              return character.source === 'community' && character.is_author ? (
                <Grid item xs={isMobile ? 12 : 6}>
                  <Button
                    variant='outlined'
                    onClick={() => handleCharacterSelection(character)}
                    sx={{
                      width: '100%',
                      position: 'relative', // Needed for pseudo-elements
                      backgroundColor: 'black',
                      color: 'white',
                      fontFamily: 'Courier New, Courier, monospace',
                      '&:before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        boxShadow:
                          'inset 1px -1px 0px rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px', // Match your button's border radius
                        pointerEvents: 'none', // Ignore this layer for mouse events
                      },
                      boxShadow:
                        pressedCharacterId === character.character_id
                          ? 'inset 0px 4px 4px rgba(0, 0, 0, 0.25), 4px 4px 5px 0 rgba(0, 0, 0, 0.5)' // Both shadows coexisting
                          : '4px 4px 5px 0 rgba(0, 0, 0, 0.5)', // Drop shadow for 3D effect
                      transform:
                        pressedCharacterId === character.character_id
                          ? 'translate(2px, 2px)'
                          : 'none', // Keep the button pressed
                      borderColor:
                        pressedCharacterId === character.character_id
                          ? 'white'
                          : 'black',
                      '&:hover': {
                        backgroundColor: 'black', // Default hover background color
                        boxShadow: '3px 3px 4px 0 rgba(0,0,0,0.4)', // Lighter shadow on hover
                        borderColor:
                          pressedCharacterId === character.character_id
                            ? 'white'
                            : 'black', // Conditional border color on hover
                      },
                      textTransform: 'none',
                      transition: 'transform 0.1s, box-shadow 0.1s', // Smooth transition for pressing effect
                    }}
                  >
                    <Avatar
                      alt={character.name}
                      src={character.image_url}
                      sx={{ marginRight: 1 }}
                    />
                    <div style={{ display: 'block', textAlign: 'left' }}>
                      <Typography
                        variant='body1'
                        sx={{
                          color: 'white',
                          fontFamily: 'Courier New, Courier, monospace',
                        }}
                      >
                        {character.name}
                      </Typography>
                      <Typography
                        variant='body1'
                        sx={{
                          color: '#BEC5D9',
                          fontFamily: 'Courier New, Courier, monospace',
                          fontStyle: 'italic',
                        }}
                      >
                        @{character.author_name}
                      </Typography>
                    </div>
                  </Button>
                </Grid>
              ) : null;
            })}
          </Grid>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            marginBottom: 2,
            marginLeft: 2,
            marginRight: 2,
          }}
        >
          <Button
            fullWidth
            variant='contained'
            onClick={handleCloseLibraryDialog}
            sx={{ color: 'white', textTransform: 'none' }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default Characters;
