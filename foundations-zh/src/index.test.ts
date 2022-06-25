import { ErrorMessage, parseError } from '.';

// Sample 1
const testSample = new Error();
testSample.stack = `TypeError: Error raised
at bar http://192.168.31.8:8000/c.js:2:9
`;
const testSampleResult = {
  message: 'Error raised',
  stack: [
    {
      line: 2,
      column: 9,
      filename: 'http://192.168.31.8:8000/c.js',
    },
  ],
};

test('Sample 1: one line chrome error stack', () => {
  expect(parseError(testSample)).toStrictEqual(testSampleResult);
});

// Sample 2
const chromeErrMsgTxt = 'Error raised';

const fixtureStack = new Error();
fixtureStack.stack = `TypeError: Error raised
at bar http://192.168.31.8:8000/c.js:2:9
at foo http://192.168.31.8:8000/b.js:4:15
at calc http://192.168.31.8:8000/a.js:4:3
at <anonymous>:1:11
at http://192.168.31.8:8000/a.js:22:3
`;
const chromeErrMsg: ErrorMessage = parseError(fixtureStack);

test('Sample 2: Chrome error stack should have error message and parsed stack with length 4', () => {
  expect(chromeErrMsg.message).toBe(chromeErrMsgTxt);
  expect(chromeErrMsg.stack.length).toBe(4);
});

// Sample 3
const fixtureFirefoxStack = new Error();
fixtureFirefoxStack.stack = `
bar@http://192.168.31.8:8000/c.js:2:9
foo@http://192.168.31.8:8000/b.js:4:15
calc@http://192.168.31.8:8000/a.js:4:3
<anonymous>:1:11
http://192.168.31.8:8000/a.js:22:3
`;
const fireFoxErrMsg: ErrorMessage = parseError(fixtureFirefoxStack);
test('Sample 3: Firefox error stack should have NO error message but parsed stack with length 4', () => {
  expect(fireFoxErrMsg.message).toBe('');
  expect(fireFoxErrMsg.stack.length).toBe(4);
});
