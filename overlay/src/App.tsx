import React from 'react';
//import { Header, Dimmer, Loader, Input, Card } from 'semantic-ui-react';
import { bridge } from './dappletBridge';

interface Props {}

interface State {}

const defaultState: State = {};

export default class App extends React.Component<Props, State> {
  refs: any;

  constructor(props: Props) {
    super(props);
    this.state = { ...defaultState };
  }

  componentDidMount() {
    bridge.onData((data) => this.setState({ ...defaultState, ...data }));
  }

  render() {
    return (
      <div className="overlay-container">
        <h2>Hello Video Comments</h2>
      </div>
    );
  }
}
