import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import CommentWithMention from '../../components/Comment/CommentWithMention';
import {createMemoryHistory} from 'history';
import {Router} from 'react-router-dom'

const defaultProp = {
  contentObj: {
    plainTextValue: 'great comment@dylan',
    mentions: [12, "@"],
  }
}

describe("Snapshot test", () => {
  test('CommentWithMention matches snapshot', () => {
    const component = renderer.create(
        <CommentWithMention {...defaultProp}/>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Component test", () => {
  test('certain texts exists in the page', () => {
    render( <CommentWithMention {...defaultProp}/>);
    const text = screen.getByText(/great comment@dylan/i)
    expect(text).toBeInTheDocument()
  })
});

describe("Event test", () => {
  test('nagivate to profile page', async () => {
    const history = createMemoryHistory();
    const spy = jest.spyOn(history, 'push');
    render(
      <Router location={history.location} navigator={history}>
        <CommentWithMention {...defaultProp} />
      </Router>,
    )
    fireEvent.click(screen.getByText(/dylan/i));
    // expect(history.location.pathname).toBe('/register');
  })
});

