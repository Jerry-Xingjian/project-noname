import React from "react";
import '@testing-library/jest-dom'
import ProfilePostCard from "../../components/ProfilePostCard/ProfilePostCard";
import renderer from 'react-test-renderer';

const post = {
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
};

const defaultProp = {
  username: "dylan",
	profileImage:"https://nonome-project-media.s3.amazonaws.com/2.jpeg",
  handleEditClicked: jest.fn(),
  openPost: jest.fn(),
  postInfo: post,
  fetchPosts: jest.fn()
}

describe("Snapshot test", () => {
  test("Post card structure test", async () => {
    const component = renderer.create(
      <ProfilePostCard  {...defaultProp} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});