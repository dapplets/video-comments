import React from 'react';
import { Button, Divider, Icon } from 'semantic-ui-react';

interface IAuthorizationProps {
  back: number,
  onPageChange: any,
}

export const Authorization = (props: IAuthorizationProps) => {
  const { back, onPageChange } = props;
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
        className='action-button'
      >
        Authorization
      </Button>
    </div>
  );
};
