import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import NewComment from '../../components/Comment/NewComment';

const defaultProp = {
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
  },
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
  setCommentsState: jest.fn(),
}

describe("snapshot test", () => {
  test('newComments matches snapshot', () => {
    const component = renderer.create(<NewComment {...defaultProp} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})

describe("Existence test", () => {
  test('renders new comment textarea', async() => {
    render(<NewComment {...defaultProp} />);
    expect(screen.getByText(/Post/i)).toBeInTheDocument();
  });
})

describe("Event test", () => {

  test("New comment onsubmit event test", async () => {
    render(<NewComment {...defaultProp}/>);
    const commentText = screen.getByTestId("comment-textarea");
    fireEvent.change(commentText, {target: {value: 'great post'}});
    await waitFor(() => {
      const button = screen.getByTestId("new-comment-post");
      fireEvent.click(button)
    })
    expect(screen.getByTestId("comment-textarea")).toHaveValue('');
  });

  test("changing comments test", async () => {
    render(<NewComment {...defaultProp}/>);
    await waitFor(() => {
      const textarea = screen.getByTestId("comment-textarea");
      expect(textarea).toHaveValue('');
      fireEvent.change(textarea, { target: { value: 'Test comment'} });
      expect(textarea.value).toBe('Test comment');
    })
  });
});