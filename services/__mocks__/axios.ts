import { AxiosInstance } from "axios";
import { jest } from "@jest/globals";

const axios: AxiosInstance & {
  create: jest.Mock;
  get: jest.Mock;
  post: jest.Mock;
  delete: jest.Mock;
} = {
  create: jest.fn(() => axios),
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
} as any;

export default axios;
