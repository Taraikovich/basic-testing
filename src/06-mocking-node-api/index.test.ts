import path from 'path';
import fs from 'fs';
import fsPromise from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

const fileName = 'test.txt';

jest.mock('fs');
jest.mock('fs/promises');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 100);
    expect(setTimeout).toBeCalledWith(callback, 100);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();

    doStuffByTimeout(callback, 100);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(100);
    expect(callback).toBeCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, 100);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledWith(callback, 100);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();

    doStuffByInterval(callback, 100);

    expect(callback).not.toHaveBeenCalled();

    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(100);

      expect(callback).toHaveBeenCalledTimes(i + 1);
    }
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const spy = jest.spyOn(path, 'join');
    await readFileAsynchronously(fileName);

    expect(spy).toBeCalledWith(__dirname, fileName);
  });

  test('should return null if file does not exist', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const fileContent = await readFileAsynchronously(fileName);

    expect(fileContent).toBeNull();
  });

  test('should return file content if file exists', async () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fsPromise, 'readFile').mockResolvedValue('content');
    const fileContent = await readFileAsynchronously(fileName);

    expect(typeof fileContent).toBe('string');
  });
});
