import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import React from "react";
import {Router} from 'react-router-dom'
import '@testing-library/jest-dom'
import LoginTable from '../../components/LoginTable/LoginTable';
import renderer from 'react-test-renderer';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("Component test", () => {
  test('certain texts exists in the page', () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <LoginTable />
      </Router>,
    )
    // check whether "Login and Stay connected with" exits in the screen or not
    const text = screen.getByText(/Login and Stay connected with/i)
    expect(text).toBeInTheDocument()
  })
});

describe("Snapshot test", () => {
  test('LoginTable component matches snapshot', () => {
    const history = createMemoryHistory();
    const component = renderer.create(
      <Router location={history.location} navigator={history}>
        <LoginTable />
      </Router>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Navigation test", () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
  });

  const default_data = [{ test_data: 20}];

  test("Login navigate to register page", async () => {
    // test for different effects than the page actually changing
    // capture the result of a click event and outputting history.location.pathname correctly showing as /register
    const history = createMemoryHistory();
    const spy = jest.spyOn(history, 'push');
    render(
      <Router location={history.location} navigator={history}>
        <LoginTable />
      </Router>,
    )
    const user = userEvent.setup()
    expect(screen.getByText(/Register here!/i)).toBeInTheDocument()
    await user.click(screen.getByText(/Register here!/i))

    // check that the content changed to the new page
    expect(history.location.pathname).toBe('/register');
    expect(spy).toBeCalled();
  });

//   test("Login submit info and navigate to home page", async () => {
//     const history = createMemoryHistory();
//     // spying on history.push
//     const spy = jest.spyOn(history, 'push');
//     render(
//       <Router location={history.location} navigator={history}>
//         <LoginTable />
//       </Router>,
//     )
//     // test user type email and password event
//     const email = screen.getByLabelText("Email address")
//     const password = screen.getByLabelText("Password");
//     await userEvent.type(email, "xwang@gmail.com");
//     await userEvent.type(password, "123456")
//     expect(email).toHaveValue('xwang@gmail.com')
//     expect(password).toHaveValue('123456')
    
//     // Mock POST request when param are `default_data`, 'user_id' and user input email and password
//     mock.onPost().reply(200, default_data)
//     // waitFor may run the callback function, in this case, fireEvent.click
//     // a number of times until the timeout is reached
//     // keep calling axios until got response
//     await waitFor(() => {
//       fireEvent.click(screen.getByRole('button', { name: 'Login' }));
//     });
//     // test whether the axios test is post request or not
//     expect(mock.onPost().reply(200, default_data).history.post[0].method).toEqual("post")
//     // check that the content changed to the new page
//     expect(spy).toBeCalled();
//     expect(history.location.pathname).toBe('/home');
//   });
});

describe("Event test", () => {
  test("Email and password change test", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <LoginTable />
      </Router>
    )
    const email = screen.getByLabelText("Email address");
    const password = screen.getByLabelText("Password");
    // initial email and password is expected to be null
    expect(email).toHaveValue('')
    expect(password).toHaveValue('')
    fireEvent.change(email, {target: {value: 'xwang@gmail.com'}})
    fireEvent.change(password, {target: {value: '123456'}})
    // fireEvent.change will change its contents
    expect(email).toHaveValue('xwang@gmail.com')
    expect(password).toHaveValue('123456')
  });
});

