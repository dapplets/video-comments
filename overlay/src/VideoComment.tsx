import React, { useState } from 'react';
import { Card, Comment, Icon } from 'semantic-ui-react';
import ReactTimeAgo from 'react-time-ago';

export interface IData {
  id: string,
  name: string,
  time: string,
  text: string,
  image?: string,
  from: number,
  to: number,
  selected?: boolean,
  hidden?: boolean,
}

interface IVideoCommentProps {
  data: IData,
  currentTime: number,
};

export const VideoComment = (props: IVideoCommentProps) => {
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
                <Comment.Author
                  as='a'
                  className={isHidden ? 'comment-hidden' : ''}
                >
                  {name}
                </Comment.Author>
                <Comment.Metadata style={{ flexGrow: 1 }}>
                  <div>
                    <ReactTimeAgo date={new Date(time)} locale="en-US" />
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
              <Comment.Actions hidden={text.length <= 103 || isHidden}>
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
