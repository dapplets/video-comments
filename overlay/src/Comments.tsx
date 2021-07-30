import React, { useState, useEffect } from 'react';
import { Button, Container, Dimmer, Header, Loader, Menu, MenuItemProps } from 'semantic-ui-react';
import VideoComment, { IData } from './VideoComment';
import Timeline from './Timeline';
import { bridge } from './dappletBridge';

interface ICommentsProps {
  data?: IData[]
  createComment: number
  onPageChange: any
  toggleCommentHidden: any
  videoLength: number
  currentTime: number
  updateCurrentTime: any
}

enum CommentBlock {
  All = 'All',
  Active = 'Active',
  Inactive = 'Inactive',
  Hidden = 'Hidden',
  Empty = '',
}

let counter = Math.trunc(Math.random() * 1_000_000_000);

export default (props: ICommentsProps) => {
  const { data, createComment, onPageChange, toggleCommentHidden, videoLength, currentTime, updateCurrentTime } = props;
  const [activeTab, changeActiveTab] = useState(CommentBlock.All);

  useEffect(() => bridge.onTime((data) => updateCurrentTime(Math.trunc(data.time))), []);

  const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps ) => {
    const group = data.name!;
    if (group === CommentBlock.All
      || group === CommentBlock.Active
      || group === CommentBlock.Inactive
      || group === CommentBlock.Hidden) {
        changeActiveTab(CommentBlock[group]);
      }
  }

  const countActiveComments = () =>
    data!.filter((comment) => comment.from <= currentTime && comment.to >= currentTime).length;

  return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Timeline
          videoLength={videoLength}
          currentTime={currentTime}
          updateCurrentTime={updateCurrentTime}
          activeCommentCount={data ? countActiveComments() : 0}
        />
        <Menu tabular className='dapplet-comments-menu'>
          <Menu.Item
            name={CommentBlock.Empty}
            active={activeTab === CommentBlock.Empty}
          />
          <Menu.Item
            name={CommentBlock.All}
            active={activeTab === CommentBlock.All}
            onClick={handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Active}
            active={activeTab === CommentBlock.Active}
            onClick={handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Inactive}
            active={activeTab === CommentBlock.Inactive}
            onClick={handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Hidden}
            active={activeTab === CommentBlock.Hidden}
            onClick={handleItemClick}
          />
        </Menu>
        {data
          ? (data.length === 0
            ? <Container textAlign='center' className='no-comments'>
              <Header as='h3' style={{ color: '#acacac' }}>
                There are no comments yet
              </Header>
            </Container>
            : <Container className='overlay-card'>
              {data.filter((commentData) => {
                const { from, to, hidden = false } = commentData;
                switch (activeTab) {
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
              }).map((commentData) => <VideoComment key={counter++} data={commentData} currentTime={currentTime} toggleCommentHidden={toggleCommentHidden} />)}
            </Container>)
          : <Dimmer active inverted><Loader inverted>Loading</Loader></Dimmer>}
        <Button 
          color='violet'
          className='action-button'
          onClick={() => onPageChange(createComment)}
        >
          Add comment
        </Button>
      </div>
  );
};
