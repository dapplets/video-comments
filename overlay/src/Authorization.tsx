import React from 'react';
import { Button, Divider, Icon } from 'semantic-ui-react';
import { bridge } from './dappletBridge';
import { getUserInfo } from './utils';

interface IAuthorizationProps {
  back: number
  onPageChange: any
  nextPage: number
  setNextPage: any
  accountEthId?: string
  getAccountEthId: any
  setCurrentUser: any
  setIsAdmin: any
  setAvatar: any
  setIsConnectingWallet: any
  isConnectingWallet: boolean
}

export default (props: IAuthorizationProps) => {
  const { back, onPageChange, nextPage, setNextPage, getAccountEthId, setCurrentUser, setIsAdmin, setAvatar, setIsConnectingWallet, isConnectingWallet } = props;

  return (
    <div className='second-level-page'>
      <div className='button-back'>
        <Icon name='arrow left' />
        <button onClick={() => {
          setNextPage(back);
          if (isConnectingWallet) setIsConnectingWallet(false);
          onPageChange(back);
        }}>
          Back
        </button>
      </div>
      <Divider />
      <div className='second-level-page-text'>
        <h1>You are not authorized</h1>
        <p>log in to comment</p>
      </div>
      <Button 
        color='violet'
        loading={isConnectingWallet}
        className='action-button exact'
        onClick={() => {
          if(isConnectingWallet) return;
          setIsConnectingWallet(true);
          bridge.connectWallet()
            .then(async() => {
              const accountId = await bridge.getCurrentEthereumAccount();
              getAccountEthId(accountId);
              const userInfo = await getUserInfo(accountId);
              setIsAdmin(userInfo.admin);
              setAvatar(userInfo.picture);
              const ensNames = await bridge.getEnsNames(accountId);
              const name = ensNames !== undefined && ensNames.length !== 0 && ensNames[0] !== ''  ? ensNames[0] : accountId;
              setCurrentUser(name);

              bridge.updateData();
              onPageChange(nextPage);
            })
            .catch((err) => {
              setIsConnectingWallet(false);
              console.log('Error connecting to the wallet.', err);
            });
        }}
      >
        {isConnectingWallet ? 'Loading' : 'Log in'}
      </Button>
    </div>
  );
};
