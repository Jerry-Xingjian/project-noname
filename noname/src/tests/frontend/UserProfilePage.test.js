import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import React from "react";
import jwtDecode from "jwt-decode";
import '@testing-library/jest-dom'
import UserProfilePage from '../../components/UserProfilePage/UserProfilePage';
import {BrowserRouter} from 'react-router-dom';

const userId = "6388320305d016d46329331d";
jest.mock('jwt-decode', () => jest.fn());

describe("Component test", () => {
  test('certain texts exists in the page', async() => {
		jwtDecode.mockImplementationOnce(() => ({ id: "6388320305d016d46329331d" }));
    render(
        <UserProfilePage userId={userId}/>
    )
    // check whether "Start your journey from here" exits in the screen or not
    const follower = screen.getByText(/Follower/i)
    expect(follower).toBeInTheDocument();
		//expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  })
});


describe("profile page element test", () => {
  test("test UI elements ", async () => {
		jwtDecode.mockImplementationOnce(() => ({ id: "6388320305d016d46329331d" }));
      render(
        <UserProfilePage userId={userId} />
			)
      expect(screen.getByText(/NEW POST/i)).toBeInTheDocument()
  });

  test("textbox have text after user input", async () => {
		jwtDecode.mockImplementationOnce(() => ({ id: "6388320305d016d46329331d" }));
    render(<UserProfilePage userId={userId} />);
    const element = screen.getByText('Edit Profile');
    await waitFor(() =>
      fireEvent.click(element)
    );
  })
});

