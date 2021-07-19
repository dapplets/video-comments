import React from 'react';
import { Container, Header, Dimmer, Loader, Menu, MenuItemProps } from 'semantic-ui-react';
import { bridge } from './dappletBridge';
import { Comments, IData} from './Comments';

enum CommentBlock {
  All = 'All',
  Active = 'Active',
  Inactive = 'Inactive',
  Hidden = 'Hidden',
  Empty = '',
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
    selected: true,
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
    hidden: true,
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
    name: 'Jonny',
    time: 'Today at 5:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    image: 'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
    from: 20,
    to: Infinity,
    hidden: true,
  },
  {
    id: 6,
    name: 'Anna',
    time: 'Today at 6:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    image: 'https://react.semantic-ui.com/images/avatar/small/jenny.jpg',
    from: 20,
    to: Infinity,
  },
  {
    id: 7,
    name: 'Галя',
    time: 'Today at 7:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 20,
    to: Infinity,
  },
  {
    id: 8,
    name: 'Инга',
    time: 'Today at 8:42PM',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 20,
    to: Infinity,
  },
];

const mockedTime = 10;

interface Props {}

interface State {
  activeItem: CommentBlock,
  data?: IData[] | string,
}

const defaultState: State = {
  activeItem: CommentBlock.All,
};

export default class App extends React.Component<Props, State> {
  //refs: any;

  constructor(props: Props) {
    super(props);
    this.state = { ...defaultState };
  }

  componentDidMount() {
    bridge.onData((data) => this.setState({ ...defaultState, ...data }, async () => {
      try {
        const res = await fetch('https://comments.dapplets.org/auth/anonymous/login?user=0x692a4d7B7BE2dc1623155E90B197a82D114a74f3&site=remark&aud=remark');
        const token = res.headers.get('X-Jwt');
        const headers: HeadersInit = new Headers();
        if (token) {
          headers.set('X-Jwt', token!);
          const response = await fetch('https://comments.dapplets.org/api/v1/user', { headers });
          const data = response.json();
          console.log('aaaaaaaaaaaaa', data);
          // Moking:
          //this.setState({ data });
          //this.setState({ data: 'No comments yet' });
          this.setState({ data: mockedData });
        }
      } catch (e) {
        console.log(e);
        this.setState({ data: 'No comments yet' });
      }
      try {
        const res = await fetch('https://comments.dapplets.org/auth/anonymous/login?user=0x9126d36880905fcb9e5f2a7f7c4f19703d52bc62&site=remark&aud=remark');
        const token = res.headers.get('X-Jwt');
        const headers: HeadersInit = new Headers();
        if (token) {
          headers.set('X-Jwt', token!);
          await fetch('https://comments.dapplets.org/api/v1/user', { headers }).then(x => x.json()).then((a) => console.log('bbbbbbbbbbbb', a));
        }
      } catch (e) {
        console.log(e);
      }
    }));
  }

  handleItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps ) => {
    const group = data.name!;
    if (group === CommentBlock.All
      || group === CommentBlock.Active
      || group === CommentBlock.Inactive
      || group === CommentBlock.Hidden) {
        this.setState({ activeItem: CommentBlock[group] });
      }
  }

  render() {
    const { activeItem } = this.state;
    const itemStyle = {
      marginTop: '1em',
      fontFamily: 'Roboto, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '100%',
      backgroundColor: '#F4F4F4',
    };
    return (
      <>
        <Menu tabular>
          <Menu.Item
            name={CommentBlock.Empty}
            style={itemStyle}
            active={activeItem === CommentBlock.Empty}
          />
          <Menu.Item
            name={CommentBlock.All}
            style={itemStyle}
            active={activeItem === CommentBlock.All}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Active}
            style={itemStyle}
            active={activeItem === CommentBlock.Active}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Inactive}
            style={itemStyle}
            active={activeItem === CommentBlock.Inactive}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name={CommentBlock.Hidden}
            style={itemStyle}
            active={activeItem === CommentBlock.Hidden}
            onClick={this.handleItemClick}
          />
        </Menu>
        {this.state.data
          ? (typeof this.state.data === 'string'
            ? <Container textAlign='center' className='no-comments'>
              <Header as='h3' style={{ color: '#acacac' }}>
                {this.state.data}
              </Header>
            </Container>
            : <Comments
              currentGroup={this.state.activeItem}
              data={this.state.data}
              currentTime={mockedTime}
            />)
          : <Dimmer active inverted><Loader inverted>Loading</Loader></Dimmer>}
      </>
    );
  }
}
