

export type ApiResponse<T> = {
  [K in entityKey]?: T;
} & {
  message?: string;
};

export type entityKey = 'user' | 'group' | 'event';