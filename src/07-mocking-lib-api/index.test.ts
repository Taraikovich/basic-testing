import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => ({
  throttle: (fn: () => unknown) => fn,
}));

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    jest.spyOn(axios, 'create');

    await throttledGetDataFromApi('/users/1');

    expect(axios.create).toHaveBeenCalledWith({ baseURL: 'https://jsonplaceholder.typicode.com' });
  });

  test('should perform request to correct provided url', async () => {
    const path = '/users/1';

    const mockedGet = jest.fn().mockResolvedValue({ data: {} });

    axios.create = jest.fn().mockReturnValue({ get: mockedGet });

    await throttledGetDataFromApi(path);

    expect(mockedGet).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const path = '/users/1';
    const data = { userId: 1 };

    const mockedGet = jest
      .fn()
      .mockResolvedValue({ data: data });

    axios.create = jest.fn().mockReturnValue({ get: mockedGet });

    const result = await throttledGetDataFromApi(path);

    expect(result).toEqual(data);
  });
});