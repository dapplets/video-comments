import React from 'react';
import { Button, Divider, Icon } from 'semantic-ui-react';
import { bridge } from './dappletBridge';

interface IAuthorizationProps {
  back: number
  createComment: number
  onPageChange: any
  setIsAuthorized: any
}

export default (props: IAuthorizationProps) => {
  const { back, createComment, onPageChange, setIsAuthorized } = props;
  return (
    <div className='authorisation-page'>
      <div className='button-back'>
        <Icon name='arrow left' />
        <button onClick={() => onPageChange(back)}>
          Back
        </button>
      </div>
      <Divider />
      <div className='authorisation-page-text'>
        <h1>You are not authorized</h1>
        <p>log in to comment</p>
      </div>
      <Button 
        color='violet'
        className='action-button exact'
        onClick={() => bridge.connectWallet()
          .then(() => {
            setIsAuthorized(true);
            onPageChange(createComment);
          })
          .catch((err) => console.log('Error connecting to the wallet.', err))}
      >
        Authorization
      </Button>
    </div>
  );
};
