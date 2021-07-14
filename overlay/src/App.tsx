import React from 'react';
import { Menu, MenuItemProps } from 'semantic-ui-react';
import { bridge } from './dappletBridge';

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
    bridge.onData((data) => this.setState({ ...defaultState, ...data }));
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
    );
  }
}
