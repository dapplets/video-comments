import React, { useState, useEffect } from 'react';
import { Button, Container, Dimmer, Header, Loader, Menu, MenuItemProps } from 'semantic-ui-react';
import { VideoComment, IData } from './VideoComment';
import { bridge } from './dappletBridge';

interface ICommentsProps {
  data?: IData[],
  createComment: number,
  onPageChange: any,
}

enum CommentBlock {
  All = 'All',
  Active = 'Active',
  Inactive = 'Inactive',
  Hidden = 'Hidden',
  Empty = '',
}

let counter = Math.trunc(Math.random() * 1_000_000_000);

export const Comments = (props: ICommentsProps) => {

  const { data, createComment, onPageChange } = props;

  const [activeTab, changeActiveTab] = useState(CommentBlock.All);

  const [currentTime, updateCurrentTime] = useState(0);

  useEffect(() => {
    bridge.onTime((data) => {
      const time = Math.trunc(data.time);
      if (time !== currentTime) {
        console.log('time=', time)
        //console.log('currentTime=', currentTime)
        updateCurrentTime(time);
      }
    });
  });

  const itemStyle = {
    marginTop: '1em',
    fontFamily: 'Roboto, sans-serif',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '100%',
    backgroundColor: '#F4F4F4',
  };

  const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps ) => {
    const group = data.name!;
    if (group === CommentBlock.All
      || group === CommentBlock.Active
      || group === CommentBlock.Inactive
      || group === CommentBlock.Hidden) {
        changeActiveTab(CommentBlock[group]);
      }
  }

  return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Menu tabular>
          <Menu.Item
            name={CommentBlock.Empty}
            style={itemStyle}
            active={activeTab === CommentBlock.Empty}
          />
          <Menu.Item
            name={CommentBlock.All}
            style={itemStyle}
            active={activeTab === CommentBlock.All}
            onClick={handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Active}
            style={itemStyle}
            active={activeTab === CommentBlock.Active}
            onClick={handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Inactive}
            style={itemStyle}
            active={activeTab === CommentBlock.Inactive}
            onClick={handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Hidden}
            style={itemStyle}
            active={activeTab === CommentBlock.Hidden}
            onClick={handleItemClick}
          />
        </Menu>
        <div>{'CurrentTime: ' + currentTime}</div>
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
              }).map((commentData) => <VideoComment key={counter++} data={commentData} currentTime={currentTime} />)}
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
