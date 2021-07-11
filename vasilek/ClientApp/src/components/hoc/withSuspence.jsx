import React, { Suspense } from 'react';
import Loading from '../common/Loading/Loading';

export const withSuspence = (Component) => {
  return (props) => {
    return (
      <Suspense fallback={<Loading />}>
        <Component {...props} />
      </Suspense>
    );
  };
};