import React, {Suspense} from 'react';
import Loading from '../common/Loading/Loading';

export function withSuspence<WCP>(WrappedComponent: React.ComponentType<WCP>) {
    return (props: WCP) => {
        return (
            <Suspense fallback={<Loading/>}>
                <WrappedComponent {...props} />
            </Suspense>
        );
    };
};