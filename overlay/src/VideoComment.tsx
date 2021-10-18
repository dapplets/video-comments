import React, { useRef, useState } from 'react';
import { Card, Comment, Confirm, Icon, Popup, Ref } from 'semantic-ui-react';
import ReactTimeAgo from 'react-time-ago';
import { IData } from './types';
import { formatTime, setCommentDeleted, voteForComment } from './utils';
import { bridge } from './dappletBridge';
import cn from 'classnames';

interface IVideoCommentProps {
  commentsList: number
  data: IData
  currentTime: number
  updateCurrentTime: any
  toggleCommentHidden: any
  expandedComments: string[]
  setExpandedComments: any
  selectedCommentId?: string
  setSelectedCommentId: any
  refs: any
  currentUser?: string
  videoId: string
  accountEthId?: string
  onPageChange: any
  authorization: number
  setNextPage: any
};

export default (props: IVideoCommentProps) => {
  const {
    commentsList,
    data,
    currentTime,
    updateCurrentTime,
    toggleCommentHidden,
    expandedComments,
    setExpandedComments,
    selectedCommentId,
    setSelectedCommentId,
    refs,
    videoId,
    accountEthId,
    onPageChange,
    authorization,
    setNextPage,
  } = props;

  const { id, name, ensName, time, text, image, from, to, hidden, score, vote } = data;

  const [openDimmer, toggleOpenDimmer] = useState(false);
  const [shared, setShared] = useState(false);
  const [isCopyPopupOpen, setIsCopyPopupOpen] = useState(false);

  const handleToggleIsHidden = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    toggleCommentHidden(id);
  };

  const handleToggleAdditionalInfo = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedComments(
      isCollapsed
        ? [...expandedComments, id]
        : expandedComments.filter((commentId) => commentId !== id)
    );
  };

  const handleSelectComment = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (id !== selectedCommentId) {
      setSelectedCommentId(id);
      if (isCollapsed) setExpandedComments([...expandedComments, id]);
      if (hidden === true) bridge.hideItem({ itemToHideId: id });
      updateCurrentTime(Math.ceil(from));
      bridge.highlightSticker(id);
      bridge.setCurrentTime(Math.ceil(from));
    } else {
      setSelectedCommentId();
      bridge.highlightSticker();
      if (!isCollapsed) setExpandedComments(expandedComments.filter((commentId) => commentId !== id));
    }
  };

  const handleVoteForComment = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (accountEthId === undefined) {
      setNextPage(commentsList);
      onPageChange(authorization);
      return;
    }
    await voteForComment(id, videoId, accountEthId, vote);
    bridge.updateData();
  }

  const isCollapsed = !expandedComments.includes(id);
  
  refs[id] = useRef();

  return (
    <Ref innerRef={refs[id]}>
      <Card
        style={{
          width: '100%',
          minHeight: '62px',
          boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.25)',
          borderRadius: '15px',
        }}
        className={`${
            currentTime >= from && (to === undefined || currentTime <= to) ? 'comment-active' : 'comment-inactive'
          } ${
            hidden ? 'comment-hidden' : ''
          } ${
            id === selectedCommentId ? 'comment-selected' : ''
          }`}
          onClick={handleSelectComment}
        >
        <Card.Content>
          <Comment.Group>
            <Comment>
              <Comment.Avatar src={image} />
              {!image && (
                <div className='default-badge'>
                  {(ensName || name)[0].toUpperCase()}
                </div>)}
              <Comment.Content>
                <div className='comment-header'>
                  <Comment.Author
                    as='a'
                    className={hidden ? 'comment-hidden' : ''}
                  >
                    {ensName || name}
                  </Comment.Author>
                  <Comment.Metadata style={{ flexGrow: 1 }}>
                    <div>
                      <ReactTimeAgo date={new Date(time)} locale="en-US" />
                    </div>
                  </Comment.Metadata>
                  {name === accountEthId && (
                    <>
                      <Icon 
                        name='trash alternate'
                        className={(id === selectedCommentId || !isCollapsed) && !hidden ? 'trash-icon-selected' : 'trash-icon'}
                        onClick={(e: any) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleOpenDimmer(true);
                        }}
                      />
                      <Confirm
                        open={openDimmer}
                        content='Delete this comment?'
                        confirmButton='Delete'
                        onCancel={(e: any) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleOpenDimmer(false);
                        }}
                        onConfirm={async (e: any) => {
                          e.preventDefault();
                          e.stopPropagation();
                          await setCommentDeleted(id, videoId, accountEthId!);
                          bridge.updateData();
                        }}
                      />
                    </>
                  )}
                  <Icon 
                    name={hidden ? 'eye slash outline' : 'eye'}
                    className={(id === selectedCommentId || !isCollapsed) && !hidden? 'eye-icon-selected' : 'eye-icon'}
                    onClick={handleToggleIsHidden}
                  />
                </div>
                <div
                  className='comment-header'
                  style={{ margin: '5px 0 10px' }}
                  hidden={isCollapsed || hidden}
                >
                  <Comment.Metadata>
                    <div>
                      begining: {formatTime(from)}
                    </div>
                  </Comment.Metadata>
                  <Comment.Metadata>
                    <div>
                      end: {formatTime(to)}
                    </div>
                  </Comment.Metadata>
                </div>
                <Comment.Text
                  hidden={hidden}
                  dangerouslySetInnerHTML={{ __html: text.length > 103 && isCollapsed
                    ? `${text.substring(0, 99)}...`
                    : text }}/>
                {!hidden && (
                  <Comment.Actions
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Comment.Action
                      index={id}
                      className={cn('comment-button-like', { liked: vote === 1, disabled: name === accountEthId })}
                      onClick={name !== accountEthId ? handleVoteForComment : (e: any) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    />
                    <Comment.Metadata
                      style={{ margin: '0 24px 0 6px' }}
                    >
                      {score}
                    </Comment.Metadata>
                    <Popup
                      content='Link copied!'
                      on='click'
                      hideOnScroll
                      open={isCopyPopupOpen}
                      onClose={() => setIsCopyPopupOpen(false)}
                      onOpen={() => {
                        setIsCopyPopupOpen(true);
                        setTimeout(() => {
                          setIsCopyPopupOpen(false);
                          setShared(false);
                        }, 4000);
                      }}
                      trigger={(
                        <Comment.Action
                          index={id}
                          className={cn('comment-button-share', { shared })}
                          onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShared(true);
                            bridge.createShareLink(id);
                          }}
                        />
                      )}
                    />
                    <Comment.Action
                      index={id}
                      onClick={handleToggleAdditionalInfo}
                    >
                      {isCollapsed ? 'More' : 'Less'}
                    </Comment.Action>
                  </Comment.Actions>
                )}
              </Comment.Content>
            </Comment>
          </Comment.Group>
        </Card.Content>
      </Card>
    </Ref>
  )
};
