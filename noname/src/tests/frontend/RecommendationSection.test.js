import { render, screen } from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom'
import RecommendationSection from '../../components/RecommendationSection/RecommendationSection';
import {BrowserRouter} from 'react-router-dom'
import renderer from 'react-test-renderer';

const userInfo = {
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

describe("snapshot test", () => {
  test('RecommendationCard matches snapshot', () => {
    const component = renderer.create(
      <BrowserRouter>
          <RecommendationSection userInfo={userInfo} />
      </BrowserRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})

describe("Element existence test", () => {
  test('renders Follow text', () => {
    render(
      <BrowserRouter>
          <RecommendationSection userInfo={userInfo} />
      </BrowserRouter>
    );
    const text = screen.getByText('Top Two');
    expect(text).toBeInTheDocument();
    expect(text.innerHTML).toBe('Top Two ');
  });
})