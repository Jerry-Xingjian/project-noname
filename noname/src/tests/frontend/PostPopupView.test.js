import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PostPopupView from '../../components/PostPopupView/PostPopupView';
import {BrowserRouter} from 'react-router-dom';
import renderer from 'react-test-renderer';

const props = {
  show: true, 
  onHide: () => null,
  postInfo: {
		"_id": "638baf0616bf8bf4ec672316",
		"belongUserId": "6388320305d016d46329331d",
		"likeInfo": [],
		"media": [
				{
						"url": "https://nonome-project-media.s3.amazonaws.com/2.jpeg",
						"type": "image"
				}
		],
		"caption": "1",
		"comments": [],
		"createdAt": "2022-12-03T20:18:14.794Z",
		"updateAt": "2022-12-03T20:18:14.794Z",
		"location": "2"
	},
	userInfo : {
		"_id": "6388320305d016d46329331d",
		"email": "qhao@seas.upenn.edu",
		"password": "$2b$10$Mxx3KERe2hI9GUEkb8Hsm.jr2gLNJyZYfooiGYK1RW0QBPdComYSO",
		"username": "qhao",
		"profilePicture": "https://nonome-project-media.s3.amazonaws.com/default_avatar.png",
		"followings": [],
		"followers": [],
		"createdAt": "2022-12-01T04:48:03.298Z",
		"updateAt": "2022-12-01T04:48:03.298Z",
		"bio": "This is some bio of the user qhao.\nThis can be super long but it's fine."
	}
};

describe("snapshot test", () => {
  test('PostPopupView matches snapshot', async () => {
    const component = renderer.create(
      <PostPopupView {...props}/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})

// describe("Existence test", () => {
//   test('renders post popup sections', async() => {
//     render(
//       <PostPopupView {...props}/>
//     );
//     expect(screen.getByText('Post')).toBeInTheDocument()
//   });
// });