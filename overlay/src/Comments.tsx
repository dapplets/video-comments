import React, { useState, useEffect } from 'react';
import { Button, Container, Dimmer, Dropdown, Form, Header, Icon, Loader, Menu, MenuItemProps } from 'semantic-ui-react';
import VideoComment from './VideoComment';
import Timeline from './Timeline';
import { bridge } from './dappletBridge';
import { IData, SortTypes } from './types';
import { deleteComment } from './utils';

interface ICommentsProps {
  data?: IData[]
  createComment: number
  authorization: number
  commentsList: number
  onPageChange: any
  toggleCommentHidden: any
  videoLength: number
  currentTime: number
  updateCurrentTime: any
  isAdmin: boolean
  selectedCommentId?: string
  setSelectedCommentId: any
  refs: any
  accountEthId?: string
  currentUser?: string
  videoId: string
  expandedComments: string[]
  setExpandedComments: any
  setNextPage: any
  sortType: SortTypes
  setSortType: any
}

enum CommentBlock {
  All = 'All',
  Active = 'Active',
  Inactive = 'Inactive',
  Hidden = 'Hidden',
  Empty = '',
  Admin = 'Admin',
}

let counter = Math.trunc(Math.random() * 1_000_000_000);

export default (props: ICommentsProps) => {
  const {
    data,
    createComment,
    authorization,
    commentsList,
    onPageChange,
    toggleCommentHidden,
    videoLength,
    currentTime,
    updateCurrentTime,
    isAdmin,
    selectedCommentId,
    setSelectedCommentId,
    refs,
    accountEthId,
    currentUser,
    videoId,
    expandedComments,
    setExpandedComments,
    setNextPage,
    sortType,
    setSortType
  } = props;

  const [activeTab, changeActiveTab] = useState(CommentBlock.All);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');
  const [commentUrlToDelete, setCommentUrlToDelete] = useState('');

  const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps ) => {
    const group = data.name!;
    if (group === CommentBlock.All
      || group === CommentBlock.Active
      || group === CommentBlock.Inactive
      || group === CommentBlock.Hidden
      || group === CommentBlock.Admin) {
        changeActiveTab(CommentBlock[group]);
      }
  }

  const countActiveComments = () =>
    data!.filter((comment) => comment.from <= currentTime && (comment.to === undefined || comment.to >= currentTime)).length;

  const handleGoToCCPage = async () => {
    if (currentUser !== undefined) {
      onPageChange(createComment);
    } else {
      setNextPage(createComment);
      onPageChange(authorization);
    }
  };

  const handleDeleteComment = async() => {
    try {
      const isWalletConnected = await bridge.isWalletConnected();
      if (isWalletConnected) {
        const currentEthAccount = await bridge.getCurrentEthereumAccount();
        deleteComment(commentIdToDelete, commentUrlToDelete, currentEthAccount);
        setCommentIdToDelete('');
      }
    } catch (err) {
      console.log('Error connecting to the wallet.', err);
    }
  };

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
            className={activeTab === CommentBlock.All ? 'menu-active-tab' : 'menu-tab'}
          />
          <Menu.Item
            name={CommentBlock.Active}
            active={activeTab === CommentBlock.Active}
            onClick={handleItemClick}
            className={activeTab === CommentBlock.Active ? 'menu-active-tab' : 'menu-tab'}
          />
          <Menu.Item
            name={CommentBlock.Inactive}
            active={activeTab === CommentBlock.Inactive}
            onClick={handleItemClick}
            className={activeTab === CommentBlock.Inactive ? 'menu-active-tab' : 'menu-tab'}
          />
          <Menu.Item
            name={CommentBlock.Hidden}
            active={activeTab === CommentBlock.Hidden}
            onClick={handleItemClick}
            className={activeTab === CommentBlock.Hidden ? 'menu-active-tab' : 'menu-tab'}
          />
          {isAdmin && <Menu.Item
            name={CommentBlock.Admin}
            active={activeTab === CommentBlock.Admin}
            onClick={handleItemClick}
            className={activeTab === CommentBlock.Admin ? 'menu-active-tab' : 'menu-tab'}
          />}
        </Menu>
        {data
          ? (data.length === 0
            ? <Container textAlign='center' className='no-comments'>
              <Header as='h3' style={{ color: '#acacac' }}>
                There are no comments yet
              </Header>
            </Container>
            : <Container className='overlay-card'>
              <div className='comments-sort'>
                <div>
                  Sort by:
                </div>
                <Dropdown
                  defaultValue={SortTypes[sortType]}
                  selection
                  compact
                  className='dp-dropdown'
                  onChange={(e, data: any) => setSortType(data.value)}
                  options={[
                    { key: SortTypes.Timeline, text: 'Timeline', value: SortTypes.Timeline },
                    { key: SortTypes.Popular, text: 'Popular', value: SortTypes.Popular },
                    { key: SortTypes.Latest, text: 'Latest', value: SortTypes.Latest },
                  ]}/>
              </div>
              {data
                .filter((commentData) => {
                  const { from, to, hidden = false } = commentData;
                  switch (activeTab) {
                    case CommentBlock.All:
                      return true;
                    case CommentBlock.Active:
                      return !hidden && from <= currentTime && (to === undefined || to >= currentTime);
                    case CommentBlock.Inactive:
                      return !hidden && (from > currentTime || (to !== undefined && to < currentTime));
                    case CommentBlock.Hidden:
                      return hidden;
                    case CommentBlock.Admin:
                        return false;
                    default:
                      return false;
                  }
                })
                .sort((a, b) => {
                  if (sortType === SortTypes.Timeline) return a.from - b.from;
                  if (sortType === SortTypes.Popular) return b.vote - a.vote;
                  if (sortType === SortTypes.Latest) return Date.parse(b.time) - Date.parse(a.time);
                  return 0;
                })
                .map((commentData) =>
                  <VideoComment
                    commentsList={commentsList}
                    key={counter++}
                    data={commentData}
                    currentTime={currentTime}
                    updateCurrentTime={updateCurrentTime}
                    toggleCommentHidden={toggleCommentHidden}
                    expandedComments={expandedComments}
                    setExpandedComments={setExpandedComments}
                    selectedCommentId={selectedCommentId}
                    setSelectedCommentId={setSelectedCommentId}
                    refs={refs}
                    currentUser={currentUser}
                    videoId={videoId}
                    accountEthId={accountEthId}
                    authorization={authorization}
                    onPageChange={onPageChange}
                    setNextPage={setNextPage}
                  />)}
            </Container>)
          : <Dimmer active inverted><Loader inverted>Loading</Loader></Dimmer>}
        {activeTab === CommentBlock.Admin && (
          <Container>
            <Header as='h2'>Delete comment</Header>
            <Form onSubmit={handleDeleteComment}>
              <Form.Input
                label='Comment ID'
                placeholder='Comment ID'
                value={commentIdToDelete}
                onChange={(e) => setCommentIdToDelete(e.target.value)}
              />
              <Form.Input
                label='Post Url'
                placeholder='url'
                value={commentUrlToDelete}
                onChange={(e) => setCommentUrlToDelete(e.target.value)}
              />
              <Button
                type='submit'
                color='violet'
                className='action-button exact'
                disabled={commentIdToDelete === '' || commentUrlToDelete === ''}
              >
                Delete
              </Button>
            </Form>
          </Container>
        )}
        <div style={{ display: 'flex' }}>
          <div style={{
            flexGrow: 3,
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <Button 
              color='violet'
              className='action-button exact'
              onClick={handleGoToCCPage}
            >
              Add comment
            </Button>
          </div>
          <div style={{
            flexGrow: 2,
            display: 'flex',
            justifyContent: 'flex-end',
          }}>
            <Button 
              icon
              style={{
                fontFamily: 'Roboto, sans-serif',
                width: 'fit-content',
                alignSelf: 'center',
                marginTop: '21px',
                minHeight: '36px',
              }}
              onClick={() => bridge.updateData()}
            >
              <Icon name='sync alternate' />
            </Button>
          </div>
        </div>
      </div>
  );
};
