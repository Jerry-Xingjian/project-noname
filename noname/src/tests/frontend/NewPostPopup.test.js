import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import '@testing-library/jest-dom'
import NewPostPopup from "../../components/NewPostPopup/NewPostPopup";
import renderer from 'react-test-renderer';

describe("Snapshot test", () => {
	test("Post card structure test", async () => {
		const component = renderer.create(
			<NewPostPopup />
		);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});
});


describe("element test", () => {
	test("test UI elements ", async () => {
		// test for different effects than the page actually changing
		render(
			<NewPostPopup show={true}/>
		)
		await waitFor(() => {
			expect(screen.getByText(/Upload/i)).toBeInTheDocument()
		})
	});
});

describe("User input event test", () => {
	test("textbox have text after user input", async () => {
		render(<NewPostPopup show={true} />);
		const element = screen.getByTestId('new-post-caption');
		fireEvent.change(element, { target: { value: 'hello'}});
		expect(element.value).toBe('hello');
	})
});

describe("Submit button event test", () => {
	const defaultProp = {
		show: true,
		onHide: ()=>console.log('hide'),
		userId: "111",
		fetchPosts: jest.fn()
	}
	test('click on post button', async () => {
		render(<NewPostPopup  {...defaultProp}/>);
		let text = screen.getByTestId('new-post-caption');
		expect(text).toHaveValue('');
		fireEvent.change(text, {target: {value: 'I love this post'}});
		expect(text).toHaveValue('I love this post');
		const element = screen.getByTestId('new-post-button');
		fireEvent.click(element);
		// expect(text).toHaveValue('');
	})
});

