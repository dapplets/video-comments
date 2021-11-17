import React, { useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { bridge } from './dappletBridge';
import Comments from './Comments';
import CommentCreation from './CommentCreation';
import Authorization from './Authorization';
import PublicationNotice from './PublicationNotice';
import { IData, SortTypes } from './types';
import { getUserInfo, roundToMultiple } from './utils';
import cn from 'classnames';

enum Pages {
  CommentsList,
  CreateComment,
  Authorization,
  PublicationNotice,
}

export default () => {
  const [data, setData] = useState<IData[] | undefined>();
  const [page, setPage] = useState(Pages.CommentsList);
  const [duration, addDuration] = useState<number>();
  const [images, addImages] = useState<any | undefined>();
  const [currentTime, updateCurrentTime] = useState(0);
  const [doUpdateCCTimeline, setDoUpdateCCTimeline] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [isCommentPublished, setIsCommentPublished] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState<string | undefined>();
  const [accountEthId, getAccountEthId] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<string | undefined>();
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [nextPage, setNextPage] = useState<number>(Pages.CommentsList)
  const [sortType, setSortType] = useState(SortTypes.Timeline);
  const [avatar, setAvatar] = useState<string | undefined>();
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);

  const refs: any = {};

  useEffect(() => {
    bridge.onData(async (data) => {
      setData(data.commentsData);
      addImages(data.images);
      addDuration(data.duration);
      setVideoId(data.videoId);
      setSelectedCommentId(data.selectedCommentId);
    });
    bridge.onTime((data) => updateCurrentTime(roundToMultiple(data.time)));
  }, []);

  useEffect(() => {
    bridge.isWalletConnected().then(async (res: boolean) => {
      if (res) {
        const accountId = await bridge.getCurrentEthereumAccount();
        getAccountEthId(accountId);
        const userInfo = await getUserInfo(accountId);
        setIsAdmin(userInfo.admin);
        setAvatar(userInfo.picture);
        const ensNames = await bridge.getEnsNames(accountId);
        const name = ensNames !== undefined && ensNames.length !== 0 && ensNames[0] !== ''  ? ensNames[0] : accountId;
        setCurrentUser(name);
      }
    });
  }, [currentUser]);

  useEffect(() => {
    if (data && selectedCommentId) {
      if (!expandedComments.includes(selectedCommentId)) {
        setExpandedComments([...expandedComments, selectedCommentId]);
      }
      if (refs[selectedCommentId]) refs[selectedCommentId].current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    bridge.isWalletConnected().then(async (res: boolean) => {
      if (res) {
        const accountId = await bridge.getCurrentEthereumAccount();
        getAccountEthId(accountId);
        const userInfo = await getUserInfo(accountId);
        setIsAdmin(userInfo.admin);
        setAvatar(userInfo.picture);
        const ensNames = await bridge.getEnsNames(accountId);
        const name = ensNames !== undefined && ensNames.length !== 0 && ensNames[0] !== ''  ? ensNames[0] : accountId;
        setCurrentUser(name);
      }
    });
    setIsConnectingWallet(false);
  }, [data, selectedCommentId]);

  const toggleCommentHidden = (id: string) => {
    if (selectedCommentId === id) {
      setSelectedCommentId(undefined);
      bridge.highlightSticker();
    }
    bridge.hideItem({ itemToHideId: id });
  };

  const openPage: Map<Pages, React.ReactElement> = new Map();

  openPage.set(
    Pages.CommentsList,
    <Comments
      createComment={Pages.CreateComment}
      authorization={Pages.Authorization}
      commentsList={Pages.CommentsList}
      data={data}
      onPageChange={setPage}
      toggleCommentHidden={toggleCommentHidden}
      videoLength={duration}
      currentTime={typeof currentTime !== 'number' || Number.isNaN(currentTime) ? 0 : currentTime}
      updateCurrentTime={updateCurrentTime}
      isAdmin={isAdmin}
      selectedCommentId={selectedCommentId}
      setSelectedCommentId={setSelectedCommentId}
      refs={refs}
      accountEthId={accountEthId}
      currentUser={currentUser}
      videoId={videoId}
      expandedComments={expandedComments}
      setExpandedComments={setExpandedComments}
      setNextPage={setNextPage}
      sortType={sortType}
      setSortType={setSortType}
    />
  );

  openPage.set(
    Pages.CreateComment,
    currentUser === undefined
    ? <Authorization
      back={Pages.CommentsList}
      nextPage={nextPage}
      setNextPage={setNextPage}
      onPageChange={setPage}
      accountEthId={accountEthId}
      getAccountEthId={getAccountEthId}
      setCurrentUser={setCurrentUser}
      setIsAdmin={setIsAdmin}
      setAvatar={setAvatar}
      setIsConnectingWallet={setIsConnectingWallet}
      isConnectingWallet={isConnectingWallet}
    />
    : <>{duration !== undefined && <CommentCreation
      back={Pages.CommentsList}
      publicationNotice={Pages.PublicationNotice}
      images={images}
      onPageChange={setPage}
      videoLength={duration}
      updateCurrentTime={updateCurrentTime}
      currentTime={typeof currentTime !== 'number' || Number.isNaN(currentTime) ? 0 : currentTime}
      doUpdateCCTimeline={doUpdateCCTimeline}
      setDoUpdateCCTimeline={setDoUpdateCCTimeline}
      videoId={videoId}
      setIsCommentPublished={setIsCommentPublished}
      message={message}
      setMessage={setMessage}
      setNextPage={setNextPage}
    />}</>
  );

  openPage.set(
    Pages.Authorization,
    <Authorization
      back={Pages.CommentsList}
      nextPage={nextPage}
      setNextPage={setNextPage}
      onPageChange={setPage}
      accountEthId={accountEthId}
      getAccountEthId={getAccountEthId}
      setCurrentUser={setCurrentUser}
      setIsAdmin={setIsAdmin}
      setAvatar={setAvatar}
      setIsConnectingWallet={setIsConnectingWallet}
      isConnectingWallet={isConnectingWallet}
    />
  );

  openPage.set(
    Pages.PublicationNotice,
    <PublicationNotice
      back={Pages.CommentsList}
      createComment={Pages.CreateComment}
      authorization={Pages.Authorization}
      onPageChange={setPage}
      isCommentPublished={isCommentPublished}
      setMessage={setMessage}
      setDoUpdateCCTimeline={setDoUpdateCCTimeline}
    />
  );

  return (
    <>
      <div className='dp-header'>
        {accountEthId === undefined || currentUser === undefined ? (
          <>
            <div className='user-info unlogged'>
              <div className='user-image' />
            </div>
            <h3 className='dp-title'>Video Comments</h3>
            <div style={{ flexGrow: 1 }} />
            <Button 
              className={cn('login-button', { 'bt-loading': isConnectingWallet })}
              loading={isConnectingWallet}
              onClick={() => {
                if (isConnectingWallet) return;
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
                    setPage(nextPage);
                  })
                  .catch((err) => {
                    setIsConnectingWallet(false);
                    console.log('Error connecting to the wallet.', err);
                  });
              }}
            >
              {isConnectingWallet ? 'Loading' : 'Log in'}
            </Button>          
          </>
        ) : (
          <>
            <div className='user-info'>
              <div
                className='user-image'
                style={{ background: `left 0 / 24px no-repeat url("${avatar!}")` }}
              />
              {currentUser!.length > 28 ? `${currentUser!.slice(0, 6)}...${currentUser!.slice(-4)}` : currentUser}
            </div>
            <Button 
              className='logout-button'
              onClick={() => bridge.disconnectWallet()
                .then(() => {
                  setIsAdmin(false);
                  setAvatar(undefined);
                  getAccountEthId(undefined);
                  setCurrentUser(undefined);
                  bridge.updateData();
                })
                .catch((err) => console.log('Error connecting to the wallet.', err))
              }
            >
              Log out
            </Button>
          </>
        )}

      </div>
      {openPage.get(page) ?? <></>}
    </>
  );
};
