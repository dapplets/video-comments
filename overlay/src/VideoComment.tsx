import React, { useRef } from 'react';
import { Card, Comment, Icon, Ref } from 'semantic-ui-react';
import ReactTimeAgo from 'react-time-ago';
import { IData } from './types';
import { formatTime } from './utils';

interface IVideoCommentProps {
  data: IData
  currentTime: number
  toggleCommentHidden: any
  expandedComments: string[]
  setExpandedComments: any
  selectedCommentId?: string
  refs: any
};

export default (props: IVideoCommentProps) => {
  const { data, currentTime, toggleCommentHidden, expandedComments, setExpandedComments, selectedCommentId, refs } = props;
  const { id, name, time, text, image, from, to, selected, hidden } = data;

  const handleToggleIsHidden = (event: any) => {
    event.preventDefault();
    hidden ? localStorage.removeItem(id) : localStorage.setItem(id, 'hidden');
    toggleCommentHidden(id, !hidden);
  }

  const isCollapsed = !expandedComments.includes(id);
  
  refs[id] = useRef();

  return (
    <Ref innerRef={refs[id]}>
      <Card
        style={{ width: '100%', minHeight: '62px' }}
        className={`${
            currentTime >= from && (to === undefined || currentTime <= to) ? 'comment-active' : 'comment-inactive'
          } ${
            hidden ? 'comment-hidden' : ''
          } ${
            id === selectedCommentId && !hidden ? 'comment-selected' : ''
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
                    className={hidden ? 'comment-hidden' : ''}
                  >
                    {name}
                  </Comment.Author>
                  <Comment.Metadata style={{ flexGrow: 1 }}>
                    <div>
                      <ReactTimeAgo date={new Date(time)} locale="en-US" />
                    </div>
                  </Comment.Metadata>
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
                <Comment.Actions hidden={hidden}>
                  <Comment.Action
                    index={id}
                    onClick={() => setExpandedComments(
                      isCollapsed
                        ? [...expandedComments, id]
                        : expandedComments.filter((commentId) => commentId !== id)
                    )}
                  >
                    {isCollapsed ? 'More' : 'Less'}
                  </Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          </Comment.Group>
        </Card.Content>
      </Card>
    </Ref>
  )
};
