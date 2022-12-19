// import { render, screen, fireEvent } from "@testing-library/react";
// import {createMemoryHistory} from 'history';
import React from "react";
import '@testing-library/jest-dom'
import PostSimpleCard from '../../components/PostSimpleCard/PostSimpleCard';
import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from "@testing-library/react";

const post = {
	"_id": "638baf0616bf8bf4ec672316",
	"belongUserId": "6388320305d016d46329331d",
	"likeInfo": [],
	"media": [
			{
					"url": "https://nonome-project-media.s3.amazonaws.com/2.jpeg",
					"type": "image"
			}
	],
	"caption": "1",
	"comments": [],
	"createdAt": "2022-12-03T20:18:14.794Z",
	"updateAt": "2022-12-03T20:18:14.794Z",
	"location": "2"
};

const userInfo = {
	"_id": "6388320305d016d46329331d",
	"email": "qhao@seas.upenn.edu",
	"password": "$2b$10$Mxx3KERe2hI9GUEkb8Hsm.jr2gLNJyZYfooiGYK1RW0QBPdComYSO",
	"username": "qhao",
	"profilePicture": "https://nonome-project-media.s3.amazonaws.com/default_avatar.png",
	"followings": [],
	"followers": [],
	"createdAt": "2022-12-01T04:48:03.298Z",
	"updateAt": "2022-12-01T04:48:03.298Z",
	"bio": "This is some bio of the user qhao.\nThis can be super long but it's fine."
}

describe("Snapshot test", () => {
  test("Post card structure test", async () => {
    const component = renderer.create(
      <PostSimpleCard openPost={jest.fn()} postInfo={post} userInfo={userInfo} />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

// describe("Component test", () => {
//   test("Certain text exists", async() => {
//     render(
//       <PostSimpleCard openPost={jest.fn()} postInfo={post} userInfo={userInfo}/>
//     )
//     const name = screen.getByText("qhao");
//     expect(name).toBeTruthy();
//   })
// })

// describe("Event test", () => {
//   test("Click comment icon", async() => {
//     render(
//       <PostSimpleCard openPost={jest.fn()} postInfo={post} userInfo={userInfo}/>
//     )
//     const comment = screen.getByTitle('comment_icon')
//     fireEvent.click(comment)
//   })
// })

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

