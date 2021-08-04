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
  } = props;

  const [accountId, getAccountId] = useState<string | undefined>();
  const [checkedSticker, changeCheckedSticker] = useState(0);
  const [checkedStickerName, changeCheckedStickerName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIsCommentPublished(false);
    bridge.isWalletConnected()
      .then(async (isWalletConnected) => {
        if (!isWalletConnected) await bridge.connectWallet();
        const currentEthAccount = await bridge.getCurrentEthereumAccount();
        getAccountId(currentEthAccount);
      });
      changeCheckedStickerName(Object.keys(images)[0]);
  }, []);

  const handleChangeCheckedSticker = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: CardProps
  ) => {
    if (typeof data.id === 'number') {
      changeCheckedSticker(data.id);
      changeCheckedStickerName(data['data-name']);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    console.log('accountId:', accountId)
    console.log('videoId:', videoId)
    console.log('message:', message)
    console.log('from:', startTime)
    console.log('to:', finishTime)
    console.log('checkedStickerName:', checkedStickerName)
    const currentSticker: ISticker = {
      id: checkedStickerName,
      vertical: 50,
      horizontal: 50,
      widthCo: 1.5,
      heightCo: 1.5,
      rotated: 1.2,
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
      console.log('Error connecting to the wallet.', err);
    }
    onPageChange(publicationNotice);
  };

  return (
    <div className='authorisation-page'>
      <div className='button-back'>
        <Icon name='arrow left' />
        <button onClick={() => onPageChange(back)}>
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
                style={{ opacity: checkedSticker === index ? '1' : '.7' }}
                onClick={handleChangeCheckedSticker}
              >
                <Image src={image} />
                <Checkbox checked={checkedSticker === index} />
              </Card>
            ))}
          </Card.Group>}
        </Container>
        <Divider />
        <Container style={{  margin: '1em 0' }}>
          <Form.TextArea
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
        />
        <Form.Button
          color='violet'
          className='action-button'
          type='submit'
          disabled={message.trim() === ''}
        >
          Publish
        </Form.Button>
      </Form>
    </div>
  )
};
