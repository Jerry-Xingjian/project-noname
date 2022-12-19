import React from "react";
import '@testing-library/jest-dom'
import EditPostPopup from "../../components/EditPostPopup/EditPostPopup";
import renderer from 'react-test-renderer';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import {BrowserRouter} from 'react-router-dom';

const post = {
  show: true, 
  onHide: () => null,
  postInfo: {
    post_id: 1,
    belong_user_id: 1,
    like_count: 20000,
    caption: "test",
    created_at: "2022-10-14T10:20:23.597Z",
    updated_at: "2022-10-15T20:07:39.292Z",
    images: [
      "http://loremflickr.com/640/48000",
      "http://loremflickr.com/640/48002",
      "http://loremflickr.com/640/48001"
    ],
  }
};

const props = {
  postInfo: {
    images: [
      "http://loremflickr.com/640/48000",
      "http://loremflickr.com/640/48002",
      "http://loremflickr.com/640/48001"
    ],
  }
}

describe("snapshot test", () => {
  test('PostPopupView matches snapshot', () => {
    let component = renderer.create(
      <BrowserRouter>
          <EditPostPopup {...props}/>
      </BrowserRouter>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
})

describe("Event test", () => {
  test("Certain text exitst in document", async () => {
    render(
      <EditPostPopup  {...post} />
    );
    const element = screen.getByPlaceholderText("Change Location...");
    fireEvent.change(element, {target: {value: 'New York, NY'}})
    //expect(element).toBe('location is here');
    const submit = screen.getByDisplayValue('SAVE')
    fireEvent.click(submit)
    expect(element).toHaveValue('New York, NY')
  })
})