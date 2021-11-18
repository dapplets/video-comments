import GeneralBridge from '@dapplets/dapplet-overlay-bridge';
import { IStickerTransform, IChangeAddingStickerImageProps } from './types';
import { getRandomInt } from './utils';

class Bridge extends GeneralBridge {
  _subId: number = 0;

  onData(callback: (data: any) => void) {
    this.subscribe('data', (data: any) => {
      this._subId = getRandomInt();
      callback(data);
      return this._subId.toString();
    });
  }

  onTime(callback: (time: any) => void) {
    this.subscribe('time', (time: any) => {
      this._subId = getRandomInt();
      callback(time);
      return this._subId.toString();
    });
  }

  onTransform(callback: (transform: IStickerTransform) => void) {
    this.subscribe('transform', (transform: IStickerTransform) => {
      this._subId = getRandomInt();
      callback(transform);
      return this._subId.toString();
    });
  }

  async connectWallet(): Promise<string> {
    return this.call('connectWallet', null, 'connectWallet_done', 'connectWallet_undone');
  }

  async disconnectWallet(): Promise<string> {
    return this.call('disconnectWallet', null, 'disconnectWallet_done', 'disconnectWallet_undone');
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

  async getEnsNames(name: string): Promise<string[] | [] | undefined> {
    return this.call(
      'getEnsNames',
      { name },
      'getEnsNames_done',
      'getEnsNames_undone',
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

  addSticker(from: number, to: number) {
    return this.call(
      'addSticker',
      { from, to },
      'addSticker_done',
      'addSticker_undone',
    );
  }

  removeAddingSticker() {
    return this.call(
      'removeAddingSticker',
      null,
      'removeAddingSticker_done',
      'removeAddingSticker_undone',
    );
  }

  getAddingStickerParams() {
    return this.call(
      'getAddingStickerParams',
      null,
      'getAddingStickerParams_done',
      'getAddingStickerParams_undone',
    );
  }

  changeAddingStickerImage(props?: IChangeAddingStickerImageProps) {
    return this.call(
      'changeAddingStickerImage',
      props,
      'changeAddingStickerImage_done',
      'changeAddingStickerImage_undone',
    );
  }

  changeStickerTransformPointTime(transformPointId: string, time: number) {
    return this.call(
      'changeStickerTransformPointTime',
      { transformPointId, time },
      'changeStickerTransformPointTime_done',
      'changeStickerTransformPointTime_undone',
    );
  }

  changeFrom(time: number) {
     return this.call(
      'changeFrom',
      { time },
      'changeFrom_done',
      'changeFrom_undone',
    );
  }

  changeTo(time: number) {
    return this.call(
      'changeTo',
      { time },
      'changeTo_done',
      'changeTo_undone',
    );
  }

  addPoint() {
    return this.call(
      'addPoint',
      null,
      'addPoint_done',
      'addPoint_undone',
    );
  }

  deletePoint() {
    return this.call(
      'deletePoint',
      null,
      'deletePoint_done',
      'deletePoint_undone',
    );
  }

  highlightSticker(stickerID?: string) {
    return this.call(
      'highlightSticker',
      stickerID ? { stickerID } : null,
      'highlightSticker_done',
      'highlightSticker_undone',
    );
  }

  async createShareLink(stickerID: string) {
    return this.call(
      'createShareLink',
      stickerID,
      'createShareLink_done',
      'createShareLink_undone',
    );
  }

  async isVideoPlaying(): Promise<boolean> {
    return this.call(
      'isVideoPlaying',
      null,
      'isVideoPlaying_done',
      'isVideoPlaying_undone',
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

  playVideo() {
    return this.call(
      'playVideo',
      null,
      'playVideo_done',
      'playVideo_undone',
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

  hideItem(props?: any) {
    return this.call(
      'hideItem',
      { props },
      'hideItem_done',
      'hideItem_undone',
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
