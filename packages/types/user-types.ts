export type UserType = {
    username: string;
    id: number;
    password: string;
    email: string;
    posts?:
        | {
              id: number;
              title: string;
              description: string;
              published: boolean;
              author?: UserType;
              authorId: number;
          }[]
        | null;
};
