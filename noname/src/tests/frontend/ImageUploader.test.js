import React from "react";
import '@testing-library/jest-dom';
import ImageUploader from "../../components/ImageUploader/ImageUploader";
import renderer from 'react-test-renderer';
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

describe("Snapshot test", () => {
  test("ImageUploader matches Snapshot", async () => {
    const component = renderer.create(
      <ImageUploader />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Component test", () => {
  test("check whether certain text exits in document", async() => {
    render(
      <ImageUploader />
    );
    const uploadText = screen.getByText('Upload Photo Here');
    expect(uploadText).toBeInTheDocument()
  });
})

describe("Event test", () => {
  let file;

  beforeEach(() => {
    file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });
  });

  test("image upload test", async() => {
    render(
      <ImageUploader />
    );
    // const uploadText = screen.getByText('Upload Photo Here');
    const uploader = screen.getByRole('presentation');

    await waitFor(() =>
      fireEvent.click(uploader, {
        target: { files: [file] },
      })
    );

    let image = document.getElementById("add");
    expect(image.files[0].name).toBe("test.png");
    expect(image.files.length).toBe(1);
  })
})

// todo: after upload, how to test the rerendered DOM