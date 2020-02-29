import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/core/styles';

// A custom theme for this app
 const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FFF',
    },
  },
});

export const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  selectEmpty: {
    marginTop: theme.spacing(1),
  },

  selectEmpty2 : {
    marginTop: theme.spacing(2),
  },

  textBox: {
    margin: theme.spacing(1),
    width: 200,
  },

  profileTextBox: {
    marginTop: theme.spacing(2),
    margin: theme.spacing(1),
    width: 100,
  },

  narrowTextBox: {
    margin: theme.spacing(1),
    width: 100,
  },

  datePicker: {
    marginLeft: theme.spacing(2),
    margin: theme.spacing(1),
    width: 150,
  },

  text: {
    margin: theme.spacing(1),
  },

  text2: {
    margin: theme.spacing(2),
  },

  box: {
    margin: theme.spacing(2),
  },

  root: {
    flexGrow: 1,
  },

  menuButton: {
    marginRight: theme.spacing(2),
  },

  title: {
    flexGrow: 1,
  },

  table: {
    minWidth: 100,
  },
  
  chart: {
    marginBottom: theme.spacing(3)
  },
}));

export default theme;