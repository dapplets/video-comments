import React, { useEffect, useState } from 'react';
import { Card, CardProps, Checkbox, Container, Divider, Form, Icon, Image } from 'semantic-ui-react';
import CCTimeline from './CCTimeline';
import { ISendingData, ISticker } from './types';
import { bridge } from './dappletBridge';
import { addComment } from './utils';

interface IProps {
  images?: any
  back: number
  publicationNotice: number
  onPageChange: any
  videoLength: number
  currentTime: number
  updateCurrentTime: any
  startTime: number
  setStartTime: any
  finishTime: number
  setFinishTime: any
  doUpdateCCTimeline: boolean
  setDoUpdateCCTimeline: any
  videoId: string
  setIsCommentPublished: any
  checkedSticker?: string 
  changeCheckedSticker: any
  message: string
  setMessage: any
}

export default (props: IProps) => {
  const {
    back,
    publicationNotice,
    onPageChange,
    images,
    videoLength,
    currentTime,
    updateCurrentTime,
    startTime,
    setStartTime,
    finishTime,
    setFinishTime,
    doUpdateCCTimeline,
    setDoUpdateCCTimeline,
    videoId,
    setIsCommentPublished,
    checkedSticker,
    changeCheckedSticker,
    message,
    setMessage,
  } = props;

  const [accountId, getAccountId] = useState<string | undefined>();
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    setIsCommentPublished(false);
    bridge.isWalletConnected()
      .then(async (isWalletConnected) => {
        if (!isWalletConnected) await bridge.connectWallet();
        const currentEthAccount = await bridge.getCurrentEthereumAccount();
        getAccountId(currentEthAccount);
      });
  }, []);

  const handleChangeCheckedSticker = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: CardProps
  ) => {
    bridge.pauseVideo();
    if (checkedSticker !== data['data-name']) {
      changeCheckedSticker(data['data-name']);
      bridge.addSticker(data['data-name'])
    } else {
      changeCheckedSticker(undefined);
      bridge.addSticker();
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const addingStickerParams: { transform: string } = await bridge.getAddingStickerParams();
    /*console.log('accountId:', accountId)
    console.log('videoId:', videoId)
    console.log('message:', message)
    console.log('from:', startTime)
    console.log('to:', finishTime)
    console.log('checkedSticker:', checkedSticker)*/
    Object.entries(addingStickerParams).forEach(([key, value]) => console.log(key + ': ' + value))
    const currentSticker: ISticker = {
      id: checkedSticker!,
      widthCo: 1,
      heightCo: 1,
      transform: addingStickerParams.transform,
    };
    const sendingData: ISendingData = {
      accountId: accountId!,
      videoId,
      text: message,
      from: startTime,
      to: finishTime,
      sticker: currentSticker,
    };
    try {
      await addComment(sendingData);
      setIsCommentPublished(true);
    } catch (err) {
      console.log('Error in the comment engine.', err);
    }
    updateCurrentTime(Math.ceil(startTime));
    bridge.setCurrentTime(Math.ceil(startTime));
    onPageChange(publicationNotice);
  };

  return (
    <div className='authorisation-page'>
      <div className='button-back'>
        <Icon name='arrow left' />
        <button onClick={() => {
          onPageChange(back);
          changeCheckedSticker(undefined);
          setIsMoving(true);
          bridge.addSticker();
        }}>
          Back
        </button>
      </div>
      <Divider />
      <Form className='authorisation-form' onSubmit={handleSubmit}>
        <Container className='stickers-container'>
          {images && <Card.Group itemsPerRow={4}>
            {Object.entries(images).map(([imageName, image], index) => (
              <Card
                id={index}
                data-name={imageName}
                key={index}
                className='sticker-card'
                style={{ opacity: checkedSticker === undefined || checkedSticker === imageName ? '1' : '.5' }}
                onClick={handleChangeCheckedSticker}
              >
                <Image src={image} />
                <Checkbox checked={checkedSticker === imageName} />
              </Card>
            ))}
          </Card.Group>}
        </Container>
        <Divider />
        <Container style={{  margin: '1em 0' }}>
          <Form.TextArea
            value={message}
            placeholder='Add text message'
            style={{ minHeight: 120, maxHeight: 'calc(70vh - 158px)' }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Container>
        <CCTimeline
          videoLength={videoLength}
          currentTime={currentTime}
          updateCurrentTime={updateCurrentTime}
          startTime={startTime}
          setStartTime={setStartTime}
          finishTime={finishTime}
          setFinishTime={setFinishTime}
          doUpdateCCTimeline={doUpdateCCTimeline}
          setDoUpdateCCTimeline={setDoUpdateCCTimeline}
          isMoving={isMoving}
          setIsMoving={setIsMoving}
        />
        <Form.Button
          color='violet'
          className='action-button'
          type='submit'
          disabled={message.trim() === '' || checkedSticker === undefined}
        >
          Publish
        </Form.Button>
      </Form>
    </div>
  )
};
