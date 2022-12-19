import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import React from "react";
import jwtDecode from "jwt-decode";
import '@testing-library/jest-dom'
import OtherUserProfilePage from '../../components/OtherUserProfilePage/OtherUserProfilePage';
import {BrowserRouter} from 'react-router-dom';

jest.mock('jwt-decode', () => jest.fn());

const userId = "6388320305d016d46329331d";
describe("Component test", () => {
  test('certain texts exists in the page', async() => {
		jwtDecode.mockImplementationOnce(() => ({ id: "6388320305d016d46329331d" }));
    render(
        <OtherUserProfilePage id={userId}/>
    )
    const follower = screen.getByText(/Follower/i)
    expect(follower).toBeInTheDocument();
		//expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  })
});


// describe("profile page element test", () => {
//   test("test UI elements ", async () => {
//       // test for different effects than the page actually changing
//       render(
//         <OtherUserProfilePage id={userId}/>
// 			)
//       expect(screen.getByText(/Follower/i)).toBeInTheDocument()
//   });
// });
