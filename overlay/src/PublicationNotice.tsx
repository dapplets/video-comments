import React, { useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { bridge } from './dappletBridge';

interface IPublicationNoticeProps {
  back: number
  createComment: number
  authorization: number
  onPageChange: any
  isCommentPublished: boolean
  setMessage: any
}

export default (props: IPublicationNoticeProps) => {
  const {
    back,
    createComment,
    authorization,
    onPageChange,
    isCommentPublished,
    setMessage,
  } = props;

  useEffect(() => {
    bridge.updateData();
    setMessage('');
  }, []);

  const handleGoToCCPage = async () => {
    try {
      const isWalletConnected = await bridge.isWalletConnected();
      onPageChange(isWalletConnected ? createComment : authorization);
    } catch (err) {
      console.log('Error connecting to the wallet. ', err);
    }
  };

  return (
    <div className='second-level-page'>
      <div className='second-level-page-text' style={{ height: '40vh' }}>
        {isCommentPublished
            ? <h2 style={{ textAlign: 'center' }}>Your comment has been posted</h2>
            : (
              <h3 style={{ textAlign: 'center' }}>
                Sorry, there was an error in posting your comment. Please try again later
              </h3>
            )}
      </div>
      <Button 
        color='violet'
        className='action-button exact'
        onClick={() => onPageChange(back)}
      >
        Go to comments
      </Button>
      <Button 
          color='violet'
          className='action-button exact'
          onClick={handleGoToCCPage}
        >
          Add another comment
        </Button>
    </div>
  );
};
