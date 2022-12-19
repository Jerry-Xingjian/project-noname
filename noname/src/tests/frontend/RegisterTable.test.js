import { render, screen, fireEvent, waitFor} from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import {createMemoryHistory} from 'history';
import React from "react";
import {Router} from 'react-router-dom'
import '@testing-library/jest-dom'
import RegisterTable from '../../components/RegisterTable/RegisterTable';
import renderer from 'react-test-renderer';
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

describe("Component test", () => {
  test('certain texts exists in the page', () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <RegisterTable />
      </Router>,
    )
    // check whether "Start your journey from here" exits in the screen or not
    const text = screen.getByText(/Start your journey from here/i)
    expect(text).toBeInTheDocument()
  })
});

describe("Snapshot test", () => {
  test('RegisterTable component matches snapshot', () => {
    const history = createMemoryHistory();
    const component = renderer.create(
      <Router location={history.location} navigator={history}>
        <RegisterTable />
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

  test("Register navigate to login page", async () => {
    // test for different effects than the page actually changing
    const history = createMemoryHistory();
    const spy = jest.spyOn(history, 'push');
    render(
      <Router location={history.location} navigator={history}>
        <RegisterTable />
      </Router>,
    )
    const user = userEvent.setup()
    expect(screen.getByText(/Login here!/i)).toBeInTheDocument()
    await user.click(screen.getByText(/Login here!/i))

    // check that the content changed to the new page
    expect(history.location.pathname).toBe('/login');
    expect(spy).toBeCalled();
  });

  test("Login navigate to home page", async () => {
    // test for different effects than the page actually changing
    const history = createMemoryHistory();
    // spying on history.push
    const spy = jest.spyOn(history, 'push');
    render(
      <Router location={history.location} navigator={history}>
        <RegisterTable />
      </Router>
    )

    // Mock POST request when param are `default_data` and user input email and password
    mock.onPost().reply(200, default_data)
    // waitFor may run the callback function, in this case, fireEvent.click
    // a number of times until the timeout is reached
    // keep calling axios until got response
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    });
    // test whether the axios test is post request or not
    expect(mock.onPost().reply(200, default_data).history.post[0].method).toEqual("post")
    // check that the content changed to the new page
    // expect(spy).toBeCalled();
    expect(history.location.pathname).toBe('/');
  });
});

describe("Event test", () => {
  test("Email, password, confirm password type test", async () => {
    const history = createMemoryHistory();
    render(
      <Router location={history.location} navigator={history}>
        <RegisterTable />
      </Router>
    )
    const email = screen.getByLabelText("Email address");
    const password = screen.getByLabelText("Password");
    const passwordConfirm = screen.getByLabelText("Confirm your password");
    await userEvent.type(email, 'xwang@gmail.com');
    expect(email).toHaveValue('xwang@gmail.com');
    await userEvent.type(password, '123456');
    expect(password).toHaveValue('123456');
    userEvent.type(passwordConfirm, '123456');
    expect(passwordConfirm).toHaveValue('123456');
  });
});


