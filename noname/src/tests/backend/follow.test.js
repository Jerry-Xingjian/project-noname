const lib = require('../../utils/api/follow.js');
const axios = require("axios");
const rootDir = require('../../utils/api/index.js')
import MockAdapter from "axios-mock-adapter";

const root = rootDir.default.root;

describe("follow", () => {
    let mock;
  
    beforeAll(() => {
      mock = new MockAdapter(axios);
    });
  
    afterEach(() => {
      mock.reset();
    });
  
    // given
    const follow = [
      {
        follower_id: 2,
        be_followed_user_id: 3
      }
    ];
    
    // follow
    describe("when post API call is successful", () => {
      it("should return follow info (then/catch)", () => {
        mock.onPost().reply(200, follow);
        // when
        let follower_id = 2
        let be_followed_user_id = 3
        const result = lib.follow(follower_id, be_followed_user_id);
  
        // then 
        expect(mock.history.post[0].url).toEqual(`${root}/follow_user`);
        result.then((data) => expect(data.data).toEqual(follow));
        result.then((data) => expect(data.status).toBe(200));
      }); 
  
      it("should return follow info (async/await)", async () => {
        mock.onPost().reply(200, follow);
  
        // when
        let follower_id = 2
        let be_followed_user_id = 3
        const result = await lib.follow(follower_id, be_followed_user_id);
  
        // then
        expect(mock.history.post[0].url).toEqual(`${root}/follow_user`);
        expect(result.data).toEqual(follow);
        expect(result.data[0].follower_id).toBe(2);
      });
    });

    // todo 
    // unfollow
    // Get followings by user id
    // Get followers by user id
});

