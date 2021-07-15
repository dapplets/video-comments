import React, { useState } from 'react';
import { Icon, Container, Card, Comment } from 'semantic-ui-react';

interface IData {
  id: number,
  name: string,
  time: string,
  text: string,
  image?: string,
  from: number,
  to: number,
}

const mockedData: IData[] = [
  {
    id: 1,
    name: 'Matt',
    time: 'Today at 5:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    image: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
    from: 0,
    to: Infinity,
  },
  {
    id: 2,
    name: 'Olivia',
    time: 'Today at 6:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    image: 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg',
    from: 0,
    to: Infinity,
  },
  {
    id: 3,
    name: 'Вася',
    time: 'Today at 7:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 0,
    to: Infinity,
  },
  {
    id: 4,
    name: 'Петя',
    time: 'Today at 8:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 0,
    to: Infinity,
  },
  {
    id: 5,
    name: 'Matt',
    time: 'Today at 5:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    image: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
    from: 0,
    to: Infinity,
  },
  {
    id: 6,
    name: 'Olivia',
    time: 'Today at 6:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    image: 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg',
    from: 0,
    to: Infinity,
  },
  {
    id: 7,
    name: 'Вася',
    time: 'Today at 7:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 0,
    to: Infinity,
  },
  {
    id: 8,
    name: 'Петя',
    time: 'Today at 8:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 0,
    to: Infinity,
  },
];

interface IProps {
  item: string,
}

export default function Comments(props: IProps) {
  // Declare a new state variable, which we'll call "count"

  return (
    <Container className='overlay-card'>
      {mockedData.map((data) => comment(data))}
    </Container>
  );
}

function comment(data: IData) {
  const { id, name, time, text, image } = data;
  const [isCollapsed, toggleIsCollapsed] = useState(true);
  const [isHidden, toggleIsHidden] = useState(false);
  const handleToggleHidden = () => {
    toggleIsHidden(!isHidden)
  }
  return (
    <Card style={{ width: '100%', minHeight: '62px' }} className={isHidden ? 'comment-hidden' : ''}>
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
                <Icon name='eye' className='eye-icon' onClick={handleToggleHidden} />
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
}