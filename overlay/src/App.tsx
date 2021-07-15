import React from 'react';
import { Menu, MenuItemProps } from 'semantic-ui-react';
import { bridge } from './dappletBridge';
import Comments from './Comments';

interface Props {}

interface State {
  activeItem: string,
}

const defaultState: State = {
  activeItem: 'All',
};

export default class App extends React.Component<Props, State> {
  refs: any;

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
          await fetch('https://comments.dapplets.org/api/v1/user', { headers }).then(x => x.json()).then((a) => console.log('aaaaaaaaaaaaa', a));
        }
      } catch (e) {
        console.log(e);
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

  handleItemClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: MenuItemProps ) => this.setState({ activeItem: data.name! })

  render() {
    const { activeItem } = this.state;
    const itemStyle = {
      marginTop: '1em',
      fontFamily: 'Roboto, sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '14px',
      lineHeight: '100%',
    };
    return (
      <>
        <Menu tabular>
          <Menu.Item
            name=''
            style={itemStyle}
            active={activeItem === ''}
          />
          <Menu.Item
            name='All'
            style={itemStyle}
            active={activeItem === 'All'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='Active'
            style={itemStyle}
            active={activeItem === 'Active'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='Inactive'
            style={itemStyle}
            active={activeItem === 'Inactive'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='Hidden'
            style={itemStyle}
            active={activeItem === 'Hidden'}
            onClick={this.handleItemClick}
          />
        </Menu>
        <Comments item={this.state.activeItem}/>
      </>
    );
  }
}
