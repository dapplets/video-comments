import React, { useEffect, useState } from 'react';
import update from 'immutability-helper';
import { bridge } from './dappletBridge';
import { IData } from './VideoComment';
import Comments from './Comments';
import CommentCreation from './CommentCreation';
import Authorization from './Authorization';
import { IRemarkComment } from './types';

enum Pages {
  CommentsList,
  CreateComment,
  Authorization,
}

export default () => {
  const [data, setData] = useState<IData[] | undefined>();
  const [page, setPage] = useState(Pages.CommentsList);
  const [videoInfo, addVideoInfo] = useState<any>({ duration: 60 });
  const [images, addImages] = useState<any[] | undefined>();
  const [currentTime, updateCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(currentTime);
  const [finishTime, setFinishTime] = useState(currentTime + 60 > videoInfo.duration ? videoInfo.duration : currentTime + 60);
  const [doUpdateCCTimeline, setDoUpdateCCTimeline] = useState(true);

  useEffect(() => bridge.onData(async (data) => {
    const structuredComments: Promise<IData>[] = data.commentsData.comments
      .map(async (commentData: any): Promise<IData> => {
        const comment: IRemarkComment = commentData.comment;
        const name = await bridge.getEnsNames([comment.user.name]);
        let from = 0;
        let to = Infinity;
        if (comment.title !== undefined) { 
          const title: { from: number, to: number } = JSON.parse(comment.title);
          from = title.from;
          to = title.to;
        }
        const structuredComment: IData = {
          id: comment.id,
          name: name[0],
          time: comment.time,
          text: comment.orig,
          image: comment.user.picture,
          from,
          to,
          hidden: localStorage.getItem(comment.id) === 'hidden'
        };
        return structuredComment;
      });
    const newData = await Promise.all(structuredComments);
    setData(newData);
    addImages(data.images);
    addVideoInfo(data.ctx);
  }), []);

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
      data={data}
      onPageChange={setPage}
      toggleCommentHidden={toggleCommentHidden}
      videoLength={videoInfo && videoInfo.duration}
      currentTime={currentTime}
      updateCurrentTime={updateCurrentTime}
    />
  );

  openPage.set(
    Pages.CreateComment,
    <CommentCreation
      back={Pages.CommentsList}
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
    />
  );

  openPage.set(
    Pages.Authorization,
    <Authorization
      back={Pages.CommentsList}
      onPageChange={setPage}
    />
  );

  return openPage.get(page) ?? <></>;
};
