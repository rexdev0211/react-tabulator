import React, {Fragment} from 'react'
import { useHistory } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

const Home = () => {
  const history = useHistory();

  const createBucket = () => {
    const bucket_id = Math.random().toString(36).substr(2, 10)

    history.push(`${process.env.PUBLIC_URL}/bucket/${bucket_id}`)
  }

  return (
    <Fragment>
      <CssBaseline />
      <Container maxWidth="md" className="home">
        <Box className="home-box">
          <Typography variant="h2" component="div" gutterBottom>
            Welcome to TABLEATOR !
          </Typography>
          <div className="btn-container">
            <Button variant="contained" size="large" onClick={() => createBucket()}>
              Create Bucket
            </Button>
          </div>
        </Box>
      </Container>
    </Fragment>
  )
}
export default Home