import React, { useEffect, useState, useRef } from 'react';
import { bridge } from './dappletBridge';
import Comments from './Comments';
import CommentCreation from './CommentCreation';
import Authorization from './Authorization';
import PublicationNotice from './PublicationNotice';
import { IData, SortTypes } from './types';
import { getUserInfo } from './utils';

enum Pages {
  CommentsList,
  CreateComment,
  Authorization,
  PublicationNotice,
}

export default () => {
  const [data, setData] = useState<IData[] | undefined>();
  const [page, setPage] = useState(Pages.CommentsList);
  const [duration, addDuration] = useState(60);
  const [images, addImages] = useState<any | undefined>();
  const [currentTime, updateCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(currentTime);
  const [finishTime, setFinishTime] = useState(currentTime + 30 > duration ? duration : currentTime + 30);
  const [doUpdateCCTimeline, setDoUpdateCCTimeline] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [isCommentPublished, setIsCommentPublished] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkedSticker, changeCheckedSticker] = useState<string>();
  const [message, setMessage] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<string | undefined>();
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [nextPage, setNextPage] = useState<number>(Pages.CommentsList)
  const [sortType, setSortType] = useState(SortTypes.Timeline);

  const refs: any = {};

  useEffect(() => {
    bridge.onData(async (data) => {
      setData(data.commentsData);
      addImages(data.images);
      addDuration(data.duration);
      setVideoId(data.videoId);
      setSelectedCommentId(data.selectedCommentId);
    });
    bridge.onTime((data) => updateCurrentTime(Math.trunc(data.time)));
  }, []);

  useEffect(() => {
    bridge.isWalletConnected().then(async (res) => {
      if (res) {
        const accountId = await bridge.getCurrentEthereumAccount();
        const userInfo = await getUserInfo(accountId);
        setIsAdmin(userInfo.admin);
        const ensNames = await bridge.getEnsNames(accountId);
        const name = ensNames !== undefined && ensNames.length !== 0 && ensNames[0] !== ''  ? ensNames[0] : accountId;
        setCurrentUser(name);
      }
    });
  }, [isAuthorized]);

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
  }, [data, selectedCommentId]);

  const toggleCommentHidden = (id: string) => {
    bridge.updateData({ itemToHideId: id });
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
      isAuthorized={isAuthorized}
      setIsAuthorized={setIsAuthorized}
      selectedCommentId={selectedCommentId}
      setSelectedCommentId={setSelectedCommentId}
      refs={refs}
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
    <CommentCreation
      back={Pages.CommentsList}
      publicationNotice={Pages.PublicationNotice}
      images={images}
      onPageChange={setPage}
      videoLength={duration}
      updateCurrentTime={updateCurrentTime}
      currentTime={typeof currentTime !== 'number' || Number.isNaN(currentTime) ? 0 : currentTime}
      startTime={startTime}
      setStartTime={setStartTime}
      finishTime={finishTime}
      setFinishTime={setFinishTime}
      doUpdateCCTimeline={doUpdateCCTimeline}
      setDoUpdateCCTimeline={setDoUpdateCCTimeline}
      videoId={videoId}
      setIsCommentPublished={setIsCommentPublished}
      checkedSticker={checkedSticker}
      changeCheckedSticker={changeCheckedSticker}
      message={message}
      setMessage={setMessage}
    />
  );

  openPage.set(
    Pages.Authorization,
    <Authorization
      back={Pages.CommentsList}
      nextPage={nextPage}
      onPageChange={setPage}
      setIsAuthorized={setIsAuthorized}
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
      changeCheckedSticker={changeCheckedSticker}
      setMessage={setMessage}
      setDoUpdateCCTimeline={setDoUpdateCCTimeline}
    />
  );

  return openPage.get(page) ?? <></>;
};
