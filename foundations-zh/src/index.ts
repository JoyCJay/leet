export interface ErrorMessage {
  message: string;
  stack: Array<ErrorStack>;
}

export interface ErrorStack {
  line: number;
  column: number;
  filename: string;
}

const chromeErrorHeadRegex = /TypeError: (.*)/;

const chromeLineParser = (line: string): undefined | ErrorStack => {
  const regex = /at ([a-z]* )?(.*\.js):([0-9]*):([0-9]*)/gi;
  const matched: RegExpExecArray | null = regex.exec(line);
  if (matched) {
    return {
      line: parseInt(matched[3]),
      column: parseInt(matched[4]),
      filename: matched[2],
    };
  }
};
const firefoxLineParser = (line: string): undefined | ErrorStack => {
  const regex = /([a-z]*@)?(.*\.js):([0-9]*):([0-9]*)/gi;
  const matched: RegExpExecArray | null = regex.exec(line);
  if (matched) {
    return {
      line: parseInt(matched[3]),
      column: parseInt(matched[4]),
      filename: matched[2],
    };
  }
};

export function parseError(err: Error): ErrorMessage {
  const result: ErrorMessage = {
    message: '',
    stack: [],
  };

  const msgLines = err.stack?.split('\n') as string[];

  let lineParser = firefoxLineParser;
  const chromeMatched: RegExpExecArray | null = chromeErrorHeadRegex.exec(
    msgLines[0]
  );
  if (chromeMatched) {
    lineParser = chromeLineParser;
    result.message = chromeMatched[1];
  }

  for (const msgLine of msgLines) {
    const stack = lineParser(msgLine);
    if (stack) {
      result.stack.push(stack);
    }
  }
  return result;
}
