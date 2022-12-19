import { render, screen, fireEvent } from "@testing-library/react";
import renderer from 'react-test-renderer';
import jwtDecode from "jwt-decode";
import {createMemoryHistory} from 'history';
import React from "react";
import {Router} from 'react-router-dom'
import '@testing-library/jest-dom'
import Navbar from '../../components/Navbar/Navbar';

jest.mock('jwt-decode', () => jest.fn());

describe("snapshot test", () => {
  test('snapshot', () => {
		jwtDecode.mockImplementationOnce(() => ({ id: "6388320305d016d46329331d" }));
		const history = createMemoryHistory();
    const component = renderer.create(
			<Router location={history.location} navigator={history}>
				<Navbar />
			</Router>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})

describe("getByText test", () => {
  test('renders logo name', () => {
    const history = createMemoryHistory();
		jwtDecode.mockImplementationOnce(() => ({ id: "6388320305d016d46329331d" }));
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <Navbar />
      </Router>,
    );
    const linkElement = getByText(/NoName/);
    expect(linkElement).toBeInTheDocument();
  });
})

// describe("Event test", () => {
//   test("Search input text change test", async () => {
//     const history = createMemoryHistory();
//     render(
//       <Router location={history.location} navigator={history}>
//         <Navbar />
//       </Router>
//     )
//     const search = screen.getByPlaceholderText("Search");
//     fireEvent.change(search, {target: {value: 'zy'}})
//     expect(search).toHaveValue('zy')
//   });
// });



// describe("Navigation test", () => {
//   test("Register navigate to login page", async () => {
//     // test for different effects than the page actually changing
//     const history = createMemoryHistory();
//     const spy = jest.spyOn(history, 'push');
//     render(
//       <Router location={history.location} navigator={history}>
//         <RegisterTable />
//       </Router>,
//     )
//     const user = userEvent.setup()
//     expect(screen.getByText(/Login here!/i)).toBeInTheDocument()
//     await user.click(screen.getByText(/Login here!/i))

//     // check that the content changed to the new page
//     expect(history.location.pathname).toBe('/login');
//     expect(spy).toBeCalled();
//   });

//   test("Login navigate to home page", async () => {
//     // test for different effects than the page actually changing
//     const history = createMemoryHistory();
//     const onSubmit = jest.fn((e) => {e.preventDefault()})
//     render(
//       <Router location={history.location} navigator={history}>
//         <RegisterTable handleSubmit = {onSubmit}/>
//       </Router>
//     )
//     const user = userEvent.setup()
//     // the belowed commented code is not complete, need improved
//     // await fireEvent.click(screen.getByRole('button', { name: 'Sign In' }), {
//     //     target: {value : 'xwang7@gmail.com'}
//     // });
//     // expect(history.location.pathname).toBe('/home');
//     // expect(onSubmit).toHaveBeenCalledTimes(1);
//   });
// });

// describe("Snapshot test", () => {
//   test('RegisterTable component matches snapshot', () => {
//     const history = createMemoryHistory();
//     const component = renderer.create(
//       <Router location={history.location} navigator={history}>
//         <RegisterTable />
//       </Router>
//     );
//     const tree = component.toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });