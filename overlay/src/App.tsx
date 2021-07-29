import React from 'react';
import update from 'immutability-helper';
import { bridge } from './dappletBridge';
import { IData } from './VideoComment';
import { Comments } from './Comments';
import { CommentCreation } from './CommentCreation';
import { Authorization } from './Authorization';
import { IRemarkComment } from './types';

/*const mockedData: IData[] = [
  {
    id: '1',
    name: 'Matt',
    time: 'December 17, 1995 03:24:00',
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
    id: '2',
    name: 'Olivia',
    time: 'December 17, 1995 04:24:00',
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
    id: '3',
    name: 'Вася',
    time: 'December 17, 1995 05:24:00',
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
    id: '4',
    name: 'Петя',
    time: 'December 17, 1995 06:24:00',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 0,
    to: Infinity,
  },
  {
    id: '5',
    name: 'Jonny',
    time: 'December 17, 1995 07:24:00',
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
    id: '6',
    name: 'Anna',
    time: 'December 17, 1995 08:24:00',
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
    id: '7',
    name: 'Галя',
    time: 'December 17, 1995 09:24:00',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 20,
    to: Infinity,
  },
  {
    id: '8',
    name: 'Инга',
    time: 'December 17, 1995 10:24:00',
    text: `In our quest to improve the user experience, 
    we miss that those seeking to displace traditional production, 
    nanotechnology, which is a vivid example of a continental-European
    type of political culture, will be objectively considered 
    by the relevant authorities!`,
    from: 20,
    to: Infinity,
  },
];*/

enum Pages {
  CommentsList,
  CreateComment,
  Authorization,
}

interface Props {}

interface State {
  data?: IData[],
  videoInfo?: any;
  page: Pages,
  images?: any[],
}

const defaultState: State = {
  page: Pages.CommentsList,
};

export default class App extends React.Component<Props, State> {
  //refs: any;

  constructor(props: Props) {
    super(props);
    this.state = { ...defaultState };
  }

  componentDidMount() {
    bridge.onData((data) => this.setState({ ...defaultState, images: data.images, videoInfo: data.ctx }, async () => {
      console.log('data.ctx', data.ctx)
      const structuredComments: Promise<IData>[] = data.commentsData.comments.map(async (commentData: any): Promise<IData> => {
        const comment: IRemarkComment = commentData.comment;
        const name = await bridge.getEnsNames([comment.user.name]);
        let from = 0;
        let to = Infinity;
        if (comment.title !== undefined) { 
          const title: { from: number, to: number } = JSON.parse(comment.title);
          from = title.from;
          to = title.to;
        }
        const structuredComment: IData = {
          id: comment.id,
          name: name[0],
          time: comment.time,
          text: comment.orig,
          image: comment.user.picture,
          from,
          to,
          hidden: localStorage.getItem(comment.id) === 'hidden'
        };
        return structuredComment;
      });
      const x = await Promise.all(structuredComments);
      console.log('x:', x)
      this.setState({ data: x });
      //this.setState({ data: mockedData });
    }));
  }

  toggleCommentHidden = (id: string, makeHidden: boolean) => {
    const commentIndex = this.state.data!.findIndex((comment) => comment.id === id);
    const newData = update(this.state.data!, { [commentIndex]: { hidden: { $set: makeHidden } } });
    this.setState({ data: newData });
  }

  render() {
    const { data, page, videoInfo } = this.state;

    const openPage: Map<Pages, React.ReactElement> = new Map();

    openPage.set(
      Pages.CommentsList,
      <Comments
        data={data}
        videoLength={videoInfo && videoInfo.duration}
        createComment={Pages.CreateComment}
        onPageChange={(page: Pages) => this.setState({ page })}
        toggleCommentHidden={this.toggleCommentHidden}
      />
    );

    openPage.set(
      Pages.CreateComment,
      <CommentCreation
        images={this.state.images}
        back={Pages.CommentsList}
        onPageChange={(page: Pages) => this.setState({ page })}
      />
    );

    openPage.set(
      Pages.Authorization,
      <Authorization
        back={Pages.CommentsList}
        onPageChange={(page: Pages) => this.setState({ page })}
      />
    );

    return openPage.get(page)
  }
}
