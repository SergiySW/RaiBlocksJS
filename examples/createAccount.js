import Rai from '../src/Rai';

/*
  Note: in order for this to work, you'll need to be running a node locally on 127.0.0.0.1:7076
  See instructions for doing that here: https://github.com/clemahieu/raiblocks/wiki/Docker-node

  To run have babel-cli installed and run:
  `babel-node ./examples/createAccount.js`
  from the root directory
*/

const rai = new Rai();

const createAccount = async () => {
  const { wallet } = await rai.wallet.create();
  const account = await rai.account.create({ wallet });

  return account;
};

createAccount().then((res) => {
  console.log(res);
});
