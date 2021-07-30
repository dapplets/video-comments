import React, { useState } from 'react';
import { Button, Card, CardProps, Checkbox, Container, Divider, Form, Icon, Image, TextArea } from 'semantic-ui-react';
import CCTimeline from './CCTimeline';

interface IProps {
  images?: any[]
  back: number
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
}

export default (props: IProps) => {
  const {
    back,
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
  } = props;
  const [checkedSticker, changeCheckedSticker] = useState(0);
  const handleChangeCheckedSticker = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, data: CardProps) =>
    typeof data.id === 'number' && changeCheckedSticker(data.id);
  return (
    <div className='authorisation-page'>
      <div className='button-back'>
        <Icon name='arrow left' />
        <button onClick={() => onPageChange(back)}>
          Back
        </button>
      </div>
      <Divider />
      <Container className='stickers-container'>
        {images && <Card.Group itemsPerRow={4}>
          <Card id={0} color='red' className='sticker-card' style={{ opacity: checkedSticker === 0 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![0]} />
            <Checkbox checked={checkedSticker === 0} />
          </Card>
          <Card id={1} color='orange' className='sticker-card' style={{ opacity: checkedSticker === 1 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![1]} />
            <Checkbox checked={checkedSticker === 1} />
          </Card>
          <Card id={2} color='yellow' className='sticker-card' style={{ opacity: checkedSticker === 2 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![2]} />
            <Checkbox checked={checkedSticker === 2} />
          </Card>
          <Card id={3} color='olive' className='sticker-card' style={{ opacity: checkedSticker === 3 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![3]} />
            <Checkbox checked={checkedSticker === 3} />
          </Card>
          <Card id={4} color='green' className='sticker-card' style={{ opacity: checkedSticker === 4 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![4]} />
            <Checkbox checked={checkedSticker === 4} />
          </Card>
          <Card id={5} color='teal' className='sticker-card' style={{ opacity: checkedSticker === 5 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![5]} />
            <Checkbox checked={checkedSticker === 5} />
          </Card>
          <Card id={6} color='blue' className='sticker-card' style={{ opacity: checkedSticker === 6 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![6]} />
            <Checkbox checked={checkedSticker === 6} />
          </Card>
          <Card id={7} color='purple' className='sticker-card' style={{ opacity: checkedSticker === 7 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![7]} />
            <Checkbox checked={checkedSticker === 7} />
          </Card>
          <Card id={8} color='red' className='sticker-card' style={{ opacity: checkedSticker === 8 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![0]} />
            <Checkbox checked={checkedSticker === 8} />
          </Card>
          <Card id={9} color='orange' className='sticker-card' style={{ opacity: checkedSticker === 9 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![1]} />
            <Checkbox checked={checkedSticker === 9} />
          </Card>
          <Card id={10} color='yellow' className='sticker-card' style={{ opacity: checkedSticker === 10 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![2]} />
            <Checkbox checked={checkedSticker === 10} />
          </Card>
          <Card id={11} color='olive' className='sticker-card' style={{ opacity: checkedSticker === 11 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![3]} />
            <Checkbox checked={checkedSticker === 11} />
          </Card>
          <Card id={12} color='green' className='sticker-card' style={{ opacity: checkedSticker === 12 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![4]} />
            <Checkbox checked={checkedSticker === 12} />
          </Card>
          <Card id={13} color='teal' className='sticker-card' style={{ opacity: checkedSticker === 13 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![5]} />
            <Checkbox checked={checkedSticker === 13} />
          </Card>
          <Card id={14} color='blue' className='sticker-card' style={{ opacity: checkedSticker === 14 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![6]} />
            <Checkbox checked={checkedSticker === 14} />
          </Card>
          <Card id={15} color='purple' className='sticker-card' style={{ opacity: checkedSticker === 15 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![7]} />
            <Checkbox checked={checkedSticker === 15} />
          </Card>
          <Card id={16} color='red' className='sticker-card' style={{ opacity: checkedSticker === 16 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![0]} />
            <Checkbox checked={checkedSticker === 16} />
          </Card>
          <Card id={17} color='orange' className='sticker-card' style={{ opacity: checkedSticker === 17 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![1]} />
            <Checkbox checked={checkedSticker === 17} />
          </Card>
          <Card id={18} color='yellow' className='sticker-card' style={{ opacity: checkedSticker === 18 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![2]} />
            <Checkbox checked={checkedSticker === 18} />
          </Card>
          <Card id={19} color='olive' className='sticker-card' style={{ opacity: checkedSticker === 19 ? '1' : '.7' }} onClick={handleChangeCheckedSticker}>
            <Image src={images![3]} />
            <Checkbox checked={checkedSticker === 19} />
          </Card>
        </Card.Group>}
      </Container>
      <Divider />
      <Container style={{ margin: '1em 0' }}>
        <Form>
          <TextArea placeholder='Add text message' style={{ minHeight: 120, maxHeight: 'calc(70vh - 80px)' }} />
        </Form>
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
      <Button 
        color='violet'
        className='action-button'
      >
        Publish
      </Button>
    </div>
  )
};
