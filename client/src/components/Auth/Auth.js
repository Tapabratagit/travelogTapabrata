import React,{useState} from 'react';
import {Avatar, Button, Paper, Grid, Typography, Container, TextField} from '@material-ui/core';
import {GoogleLogin} from 'react-google-login';
import {useDispatch} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import LockOutlineIcon from '@material-ui/icons/LockOutlined';

import Input from './Input';
import useStyles from './styles';
import Icon from './icon';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {

  const classes = useStyles();
  const [showPassoword, setShowPassoword] = useState(false);
  const [isSignUp,setIsSignUp] = useState(false);
  const [form, setForm] = useState(initialState);
  const dispatch = useDispatch();
  const history = useNavigate();

  const handleShowPassword = () => setShowPassoword((prevShowPassword) => !prevShowPassword);//without callBack infinite loop....
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp) {
      dispatch(signup(form, { push: history }));
    } else {
      dispatch(signin(form, { push: history }));
    }
  }
  const handleChange = (e) => {
    setForm({...form, [e.target.name]:e.target.value});
  }
  const switchMode = () => {
    setForm(initialState);
    setIsSignUp((prevIsSignup) => !prevIsSignup);
    setShowPassoword(false);
  }
  const googleSuccess = async(res)=>{
    const result = res?.profileObj;
    const token = res?.tokenId;
    try {
      dispatch({type: 'AUTH',data: {result, token}});
      history.push('/');
    } catch (error) {
      console.log(error);
      
    }
  }
  const googleFailure = (error)=>{
    console.log("Google Sign In was unsuccessful, Try again later!!");
    console.log(error);
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}><LockOutlineIcon /></Avatar>
        <Typography component="h1" variant="h5">{ isSignUp ? 'Sign up' : 'Sign in' }</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (<>
            <Input name='firstName' label='Frst Name' handleChange={handleChange} autoFocus half />
            <Input name='lastName' label='Last Name' handleChange={handleChange}  half />
            </>)}
            <Input name='email' label='Email Address' handleChange={handleChange} type='email' />
            <Input name='password' label='Password' handleChange={handleChange} type={showPassoword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            {isSignUp && <Input name='confirmPassword' label='Repeat Password' handleChange={handleChange} type='password' />}
          </Grid>

          <Button type='submit' fullWidth variant='contained' color='primary' className={classes.submit}>{isSignUp ? 'Sign Up' : 'Sign In'}</Button>
          <GoogleLogin clientId='310106999967-7gg91b2bhfc9p6ueo8ai18o0ejj6aeqj.apps.googleusercontent.com' render={(renderProps)=>(<Button className={classes.googleButton} color='primary' fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant='contained'>Google Sign In</Button>)} onSuccess={googleSuccess} onFailure={googleFailure} cookiePolicy='single_host_origin' />
          
          <Grid container justify='flex-end'>
            <Grid item ><Button onClick={switchMode}>
                { isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth;
