import GeneralBridge from '@dapplets/dapplet-overlay-bridge';

class Bridge extends GeneralBridge {
  _subId: number = 0;

  onData(callback: (data: any) => void) {
    this.subscribe('data', (data: any) => {
      this._subId = Math.trunc(Math.random() * 1_000_000_000);
      callback(data);
      return this._subId.toString();
    });
  }

  onTime(callback: (time: any) => void) {
    this.subscribe('time', (time: any) => {
      this._subId = Math.trunc(Math.random() * 1_000_000_000);
      callback(time);
      return this._subId.toString();
    });
  }

  async connectWallet(): Promise<string> {
    return this.call('connectWallet', null, 'connectWallet_done', 'connectWallet_undone');
  }

  async isWalletConnected(): Promise<boolean> {
    return this.call(
      'isWalletConnected',
      null,
      'isWalletConnected_done',
      'isWalletConnected_undone',
    );
  }

  async getCurrentEthereumAccount(): Promise<string> {
    return this.call(
      'getCurrentEthereumAccount',
      null,
      'getCurrentEthereumAccount_done',
      'getCurrentEthereumAccount_undone',
    );
  }

  setCurrentTime(time: number) {
    return this.call(
      'setCurrentTime',
      { time },
      'setCurrentTime_done',
      'setCurrentTime_undone',
    );
  }

  pauseVideo() {
    return this.call(
      'pauseVideo',
      null,
      'pauseVideo_done',
      'pauseVideo_undone',
    );
  }

  async playVideoIfWasPlayed() {
    return this.call(
      'playVideoIfWasPlayed',
      null,
      'playVideoIfWasPlayed_done',
      'playVideoIfWasPlayed_undone',
    );
  }

  updateData() {
    return this.call(
      'updateData',
      null,
      'updateData_done',
      'updateData_undone',
    );
  }

  public async call(
    method: string,
    args: any,
    callbackEventDone: string,
    callbackEventUndone: string,
  ): Promise<any> {
    return new Promise((res, rej) => {
      this.publish(this._subId.toString(), {
        type: method,
        message: args,
      });
      this.subscribe(callbackEventDone, (result: any) => {
        this.unsubscribe(callbackEventDone);
        this.unsubscribe(callbackEventUndone);
        res(result);
      });
      this.subscribe(callbackEventUndone, () => {
        this.unsubscribe(callbackEventUndone);
        this.unsubscribe(callbackEventDone);
        rej('The transaction was rejected.');
      });
    });
  }
}

const bridge = new Bridge();

export { bridge, Bridge };
