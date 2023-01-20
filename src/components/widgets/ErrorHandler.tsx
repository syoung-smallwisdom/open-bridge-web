import {Alert} from '@mui/lab'
import {Box, Container} from '@mui/material'
import {Redirect} from 'react-router-dom'
import Utility from '../../helpers/utility'

export function ErrorFallback(props: any) {
  console.log('ERROR:', props.error.message)
  console.log('STACK:', props.error.stack)

  return (
    <Container maxWidth="md">
      {props.error.statusCode === 401 ? (
        <Redirect to={Utility.getRedirectLinkToOneSage()} />
      ) : props.error.statusCode === 403 ? (
        <Box mx="auto" bgcolor="white" p={5} textAlign="center">
          <Alert variant="outlined" color="error" style={{marginBottom: '40px'}}>
            You do not have the permission to access this feature. Please contact your study administrator
          </Alert>

          <a href="/studies"> Back to study listings</a>
        </Box>
      ) : (
        <Alert variant="outlined" color="error" style={{marginBottom: '40px'}}>
          <pre>
            {props.error.statusCode}:&nbsp;
            {props.error.message}
          </pre>
        </Alert>
      )}
    </Container>
  )
}

export const ErrorHandler = (error: Error, info: {componentStack: string}) => {
  console.log('%cError Caught by Boundary:' + error.message, 'color:red', info.componentStack)
}
