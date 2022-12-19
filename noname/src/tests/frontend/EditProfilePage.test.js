import React from "react";
import '@testing-library/jest-dom'
import EditProfilePage from "../../components/EditProfilePage/EditProfilePage";
import renderer from 'react-test-renderer'

describe("Snapshot test", () => {
  test("Post card structure test", async () => {
    const component = renderer.create(
      <EditProfilePage />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

