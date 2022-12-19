import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Comment from '../../components/Comment/Comment';
import renderer from 'react-test-renderer';

const commentInfo = {
  belong_user: {
    post_id: '1',
    comment_id: "9b3166e5-860c-4215-9bfb-53cf6cc2b156",
    belong_post_id: '1',
    like_count: 81433,
    created_at: "2022-10-16T05:37:51.403Z",
    updated_at: "2022-10-17T17:23:13.877Z",
    belong_user_id: "30084f19-273f-4575-8882-482a7ce5a8e7",
    profile_picture: "http://loremflickr.com/640/480/fashion",
  },
  content: {
    plainTextValue: 'great comment@dylan',
    mentions: [12, "@"],
  },
}

describe("Snapshot test", () => {
  test('Comment component matches snapshot', () => {
    const component = renderer.create(
      <Comment commentInfo={commentInfo} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Component test", () => {
  test('certain texts exists in the page', () => {
    render(<Comment commentInfo={commentInfo}/>);
    const text = screen.getByText(/great comment@dylan/i);
    expect(text).toBeInTheDocument();
  })
});