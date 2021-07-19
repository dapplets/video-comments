import React, { useState } from 'react';
import { Icon, Container, Card, Comment } from 'semantic-ui-react';

export interface IData {
  id: number,
  name: string,
  time: string,
  text: string,
  image?: string,
  from: number,
  to: number,
  selected?: boolean,
  hidden?: boolean,
}

interface IProps {
  data: IData[],
  currentTime: number,
  currentGroup: CommentBlock,
}

enum CommentBlock {
  All = 'All',
  Active = 'Active',
  Inactive = 'Inactive',
  Hidden = 'Hidden',
  Empty = '',
}

let counter = Math.trunc(Math.random() * 1_000_000_000);

export const Comments = (props: IProps) => {
  const { data, currentTime, currentGroup } = props;

  return (
    <Container className='overlay-card'>
      {data.filter((commentData) => {
        const { id, name, time, text, image, from, to, selected = false, hidden = false } = commentData;
        switch (currentGroup) {
          case CommentBlock.All:
            return true;
          case CommentBlock.Active:
            return !hidden && from <= currentTime && to >= currentTime;
          case CommentBlock.Inactive:
            return !hidden && (from > currentTime || to < currentTime);
          case CommentBlock.Hidden:
            return hidden;
          default:
            return false;
        }
      }).map((commentData) => <VideoComment key={counter++} data={commentData} currentTime={currentTime} />)}
    </Container>
  );
};

interface IVideoCommentProps {
  data: IData,
  currentTime: number,
};

const VideoComment = (props: IVideoCommentProps) => {
  const { data, currentTime } = props;
  const { id, name, time, text, image, from, to, selected, hidden } = data;
  const [isCollapsed, toggleIsCollapsed] = useState(true);
  const [isHidden, toggleIsHidden] = useState(hidden ?? false);
  return (
    <Card
      style={{ width: '100%', minHeight: '62px' }}
      className={`${
          currentTime >= from && currentTime <= to ? 'comment-active' : 'comment-inactive'
        } ${
          isHidden ? 'comment-hidden' : ''
        } ${
          selected && !isHidden ? 'comment-selected' : ''
        }`}
      >
      <Card.Content>
        <Comment.Group>
          <Comment>
            <Comment.Avatar src={image} />
            {!image && (
              <div className='default-badge'>
                {name[0].toUpperCase()}
              </div>)}
            <Comment.Content>
              <div className='comment-header'>
                <Comment.Author as='a'className={isHidden ? 'comment-hidden' : ''}>
                  {name}
                </Comment.Author>
                <Comment.Metadata style={{ flexGrow: 1 }}>
                  <div>
                    {time}
                  </div>
                </Comment.Metadata>
                <Icon 
                  name={isHidden ? 'eye slash outline' : 'eye'}
                  className={(selected || !isCollapsed) && !isHidden? 'eye-icon-selected' : 'eye-icon'}
                  onClick={() => toggleIsHidden(!isHidden)}
                />
              </div>
              <Comment.Text hidden={isHidden}>
                {text.length > 103 && isCollapsed
                  ? `${text.substring(0, 99)}...`
                  : text}
              </Comment.Text>
              <Comment.Actions hidden={isHidden}>
                <Comment.Action
                  index={id}
                  onClick={() => toggleIsCollapsed(!isCollapsed)}
                >
                  {isCollapsed ? 'More' : 'Less'}
                </Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        </Comment.Group>
      </Card.Content>
    </Card>
  )
};
