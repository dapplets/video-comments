import React, { useEffect, useState } from 'react';
import update from 'immutability-helper';
import { bridge } from './dappletBridge';
import Comments from './Comments';
import CommentCreation from './CommentCreation';
import Authorization from './Authorization';
import PublicationNotice from './PublicationNotice';
import { IData, IRemarkComment } from './types';
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
  const [videoInfo, addVideoInfo] = useState<any>({ duration: 60 });
  const [images, addImages] = useState<any | undefined>();
  const [currentTime, updateCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(currentTime);
  const [finishTime, setFinishTime] = useState(currentTime + 60 > videoInfo.duration ? videoInfo.duration : currentTime + 60);
  const [doUpdateCCTimeline, setDoUpdateCCTimeline] = useState(true);
  const [videoId, setVideoId] = useState('');
  const [isCommentPublished, setIsCommentPublished] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => bridge.onData(async (data) => {
    const structuredComments: Promise<IData>[] = data.commentsData.comments
      .map(async (commentData: any): Promise<IData> => {
        const comment: IRemarkComment = commentData.comment;
        const ensNames = await bridge.getEnsNames([comment.user.name]);
        const name = ensNames.length !== 0 ? ensNames[0] : comment.user.name;
        let from = 0;
        let to = Infinity;
        let sticker: string | undefined;
        if (comment.title !== undefined) { 
          const title: { from: number, to: number, sticker?: string } = JSON.parse(comment.title);
          from = title.from;
          to = title.to;
          sticker = title.sticker;
        }
        const structuredComment: IData = {
          id: comment.id,
          name: name,
          time: comment.time,
          text: comment.text,
          image: comment.user.picture,
          from,
          to,
          sticker,
          hidden: localStorage.getItem(comment.id) === 'hidden',
          url: comment.locator.url,
        };
        return structuredComment;
      });
    const newData = await Promise.all(structuredComments);
    setData(newData);
    addImages(data.images);
    addVideoInfo(data.ctx);
    setVideoId(data.videoId);
  }), []);

  useEffect(() => {
    bridge.isWalletConnected().then(async (res) => {
      if (res) {
        const accountId = await bridge.getCurrentEthereumAccount();
        const userInfo = await getUserInfo(accountId);
        setIsAdmin(userInfo.admin)
      }
    });
  }, [isAuthorized]);

  const toggleCommentHidden = (id: string, makeHidden: boolean) => {
    const commentIndex = data!.findIndex((comment) => comment.id === id);
    const newData = update(data!, { [commentIndex]: { hidden: { $set: makeHidden } } });
    setData(newData);
  };

  const openPage: Map<Pages, React.ReactElement> = new Map();

  openPage.set(
    Pages.CommentsList,
    <Comments
      createComment={Pages.CreateComment}
      authorization={Pages.Authorization}
      data={data}
      onPageChange={setPage}
      toggleCommentHidden={toggleCommentHidden}
      videoLength={videoInfo && videoInfo.duration}
      currentTime={currentTime}
      updateCurrentTime={updateCurrentTime}
      isAdmin={isAdmin}
      isAuthorized={isAuthorized}
      setIsAuthorized={setIsAuthorized}
    />
  );

  openPage.set(
    Pages.CreateComment,
    <CommentCreation
      back={Pages.CommentsList}
      publicationNotice={Pages.PublicationNotice}
      images={images}
      onPageChange={setPage}
      videoLength={videoInfo && videoInfo.duration}
      updateCurrentTime={updateCurrentTime}
      currentTime={currentTime}
      startTime={startTime}
      setStartTime={setStartTime}
      finishTime={finishTime}
      setFinishTime={setFinishTime}
      doUpdateCCTimeline={doUpdateCCTimeline}
      setDoUpdateCCTimeline={setDoUpdateCCTimeline}
      videoId={videoId}
      setIsCommentPublished={setIsCommentPublished}
    />
  );

  openPage.set(
    Pages.Authorization,
    <Authorization
      back={Pages.CommentsList}
      createComment={Pages.CreateComment}
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
    />
  );

  return openPage.get(page) ?? <></>;
};
