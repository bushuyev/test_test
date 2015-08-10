import {User} from 'src/elements/model/user.js';

export var MyTest = {
    is: "my-test",

    method: function () {
      console.log("method, user=" + this.val);
    },

    ready: function () {
      this.user = new User('Billy');
      console.log("ready: val=" + this.val + " e=" + new Error().stack);
    }
};
