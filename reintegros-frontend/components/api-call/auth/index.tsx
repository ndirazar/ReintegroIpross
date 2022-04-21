import { NextPage } from 'next';
import React, { useContext } from 'react';
import jwt from 'jsonwebtoken';
import { IAuthContext } from './types';
import { createContext } from 'react';
import Cookies from 'universal-cookie';

export const AuthContext = createContext<IAuthContext>(null);
export const AuthContextProvider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;
export const useAuth = () => useContext(AuthContext);

export const withAuth = (Page: NextPage) => {
  const wrapper = (props: any) => {
    return (
      <AuthContextProvider value={props.user}>
        <Page {...props} />
      </AuthContextProvider>
    );
  };

  wrapper.getInitialProps = async (ctx) => {
    const props = Page.getInitialProps && (await Page.getInitialProps(ctx));
    let user: IAuthContext = null;
    try {
      const cookies = new Cookies(ctx?.req?.headers?.cookie);
      const { user_id, username, name, lastname, role }: any = jwt.decode(cookies.get('access'));
      user = { user_id, name, lastname, role, username };
    } catch (e) {
      // Do nothing
    }
    return { ...props, user };
  };
};
