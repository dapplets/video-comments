import React, { useEffect, useState } from 'react';
import { Card, CardProps, Checkbox, Confirm, Container, Divider, Form, Icon, Image, Modal } from 'semantic-ui-react';
import CCTimeline from './CCTimeline';
import CCTimelineTimeScope from './CCTimelineTimeScope';
import Player from './Player';
import { IPoint, ISendingData, ISticker, IStickerTransform } from './types';
import { bridge } from './dappletBridge';
import { addComment, getRandomInt, roundToMultiple } from './utils';

interface IProps {
  images: any
  back: number
  publicationNotice: number
  onPageChange: any
  videoLength: number
  currentTime: number
  updateCurrentTime: any
  doUpdateCCTimeline: boolean
  setDoUpdateCCTimeline: any
  videoId: string
  setIsCommentPublished: any
  message: string
  setMessage: any
  setNextPage: any
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
    doUpdateCCTimeline,
    setDoUpdateCCTimeline,
    videoId,
    setIsCommentPublished,
    message,
    setMessage,
    setNextPage,
  } = props;

  const defaultAddingStickerDuration = 30

  const [from, setFrom] = useState(currentTime);
  const [to, setTo] = useState(currentTime + defaultAddingStickerDuration > videoLength ? videoLength : currentTime + defaultAddingStickerDuration);
  const [checkedStickerImage, changeCheckedStickerImage] = useState<string>();
  const [accountId, getAccountId] = useState<string>();
  const [isMoving, setIsMoving] = useState(false);
  const [openDimmer, toggleOpenDimmer] = useState(false);
  const [addingStickerTransform, updateAddingStickerTransform] = useState<IStickerTransform>();

  useEffect(() => {
    if (doUpdateCCTimeline) {
      setFrom(roundToMultiple(currentTime));
      setTo(roundToMultiple(currentTime + defaultAddingStickerDuration > videoLength ? videoLength : currentTime + defaultAddingStickerDuration));
    }
  }, [currentTime]);

  useEffect(() => {
    setIsCommentPublished(false);
    bridge.isWalletConnected().then(async (isWalletConnected) => {
      if (!isWalletConnected) await bridge.connectWallet();
      const currentEthAccount = await bridge.getCurrentEthereumAccount();
      await bridge.addSticker(from, to);
      await bridge.onTransform(async (transform: IStickerTransform) => {
        // console.log('transform from overlay', transform)
        updateAddingStickerTransform(transform);
      })
      getAccountId(currentEthAccount);
    });
  }, []);

  const handleChangeCheckedStickerImage = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    data: CardProps
  ) => {
    bridge.pauseVideo();
    setDoUpdateCCTimeline(false);
    if (checkedStickerImage === data['data-name']) {
      changeCheckedStickerImage(undefined);
      bridge.changeAddingStickerImage(undefined)
    } else {
      changeCheckedStickerImage(data['data-name']);
      bridge.changeAddingStickerImage({ stickerName: data['data-name'], from, to });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const addingStickerParams: { transform: IStickerTransform } = await bridge.getAddingStickerParams();
    const currentSticker: ISticker = {
      id: checkedStickerImage!,
      widthCo: 1,
      heightCo: 1,
      transform: addingStickerParams.transform,
    };
    const sendingData: ISendingData = {
      accountId: accountId!,
      videoId,
      text: message,
      from,
      to,
      sticker: currentSticker,
    };
    try {
      await addComment(sendingData);
      setIsCommentPublished(true);
    } catch (err) {
      console.log('Error in the comment engine.', err);
    }
    updateCurrentTime(from);
    bridge.setCurrentTime(from);
    onPageChange(publicationNotice);
  };

  return (
    <div className='second-level-page'>
      <div className='button-back'>
        <Icon name='arrow left' />
        <button onClick={(e: any) => {
          e.preventDefault();
          e.stopPropagation();
          if (message !== '' || checkedStickerImage !== undefined || addingStickerTransform !== undefined) {
            toggleOpenDimmer(true);
          } else {
            setNextPage(back);
            onPageChange(back);
            changeCheckedStickerImage(undefined);
            setMessage('');
            updateAddingStickerTransform(undefined);
            setIsMoving(true);
            setDoUpdateCCTimeline(true);
            bridge.removeAddingSticker();
          }
        }}>
          Back
        </button>
        <Confirm
          open={openDimmer}
          header='Quit creating the comment?'
          content='Changes you made so far will not be saved'
          confirmButton='Yes, quit'
          cancelButton='Keep creating'
          onCancel={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
            toggleOpenDimmer(false);
          }}
          onConfirm={async (e: any) => {
            e.preventDefault();
            e.stopPropagation();
            setNextPage(back);
            onPageChange(back);
            changeCheckedStickerImage(undefined);
            setMessage('');
            updateAddingStickerTransform(undefined);
            setIsMoving(true);
            setDoUpdateCCTimeline(true);
            bridge.removeAddingSticker();
          }}
        />
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
                style={{ opacity: checkedStickerImage === undefined || checkedStickerImage === imageName ? '1' : '.5' }}
                onClick={handleChangeCheckedStickerImage}
              >
                <Image src={image} />
                <Checkbox checked={checkedStickerImage === imageName} />
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
        {videoLength !== undefined && (
          <>
            <CCTimelineTimeScope
              videoLength={videoLength}
              currentTime={currentTime}
              updateCurrentTime={updateCurrentTime}
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
              doUpdateCCTimeline={doUpdateCCTimeline}
              setDoUpdateCCTimeline={setDoUpdateCCTimeline}
              isMoving={isMoving}
              setIsMoving={setIsMoving}
              addingStickerTransform={addingStickerTransform}
            />
            <CCTimeline
              videoLength={videoLength}
              currentTime={currentTime}
              updateCurrentTime={updateCurrentTime}
              from={from}
              setFrom={setFrom}
              to={to}
              setTo={setTo}
              doUpdateCCTimeline={doUpdateCCTimeline}
              setDoUpdateCCTimeline={setDoUpdateCCTimeline}
              isMoving={isMoving}
              setIsMoving={setIsMoving}
              addingStickerTransform={addingStickerTransform}
              updateAddingStickerTransform={updateAddingStickerTransform}
            />
          </>
        )}
        <Player
          from={from}
          to={to}
          currentTime={currentTime}
          addingStickerTransform={addingStickerTransform}
          doUpdateCCTimeline={doUpdateCCTimeline}
          setDoUpdateCCTimeline={setDoUpdateCCTimeline}
        />
        <Form.Button
          color='violet'
          className='action-button'
          type='submit'
          disabled={message.trim() === '' || checkedStickerImage === undefined}
        >
          Publish
        </Form.Button>
      </Form>
    </div>
  )
};
