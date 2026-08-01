import { AxiosResponse } from 'axios';

export const signup: (data: Record<string, unknown>) => Promise<AxiosResponse<any>>;
export const login: (data: Record<string, unknown>) => Promise<AxiosResponse<any>>;
export const getMe: () => Promise<AxiosResponse<any>>;

export const createSession: (data: Record<string, unknown>) => Promise<AxiosResponse<any>>;
export const startSession: (id: string) => Promise<AxiosResponse<any>>;
export const pauseSession: (id: string) => Promise<AxiosResponse<any>>;
export const resumeSession: (id: string) => Promise<AxiosResponse<any>>;
export const endSession: (id: string, data?: Record<string, unknown>) => Promise<AxiosResponse<any>>;
export const cancelSession: (id: string) => Promise<AxiosResponse<any>>;
export const getSessionHistory: () => Promise<AxiosResponse<any>>;
export const getUserStats: () => Promise<AxiosResponse<any>>;
