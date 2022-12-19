import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import React from "react";
import '@testing-library/jest-dom'
import RecommendationCard from '../../components/RecommendationCard/RecommendationCard';
import {BrowserRouter, Router} from 'react-router-dom';
import renderer from 'react-test-renderer';
import {createMemoryHistory} from 'history';

const prop = {
  recommendedInfo: {
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
	userInfo: {
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
}

describe("snapshot test", () => {
  test('RecommendationCard matches snapshot', () => {
    const component = renderer.create(
      <BrowserRouter>
          <RecommendationCard {...prop}/>
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
          <RecommendationCard {...prop}/>
      </BrowserRouter>
    );
    const followText = screen.getByText('Follow');
    expect(followText).toBeInTheDocument();
    expect(followText.innerHTML).toBe('Follow');
  });
})

describe("Event test", () => {
  test('click card title and navigate to other profile page', async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
          <RecommendationCard {...prop}/>
      </Router>
    );
    const user = userEvent.setup()
    user.click(screen.getByRole("presentation"))
    expect(history.location.pathname).toBe('/');
  }) 
})

describe("Click Event test", () => {
  test('click follow', async () => {
    render(
      <BrowserRouter >
          <RecommendationCard {...prop}/>
      </BrowserRouter>
    );
    const follow = screen.getByRole('button', { name: 'Follow' })
    await waitFor(() => {
      userEvent.click(follow)
    });
  });
})