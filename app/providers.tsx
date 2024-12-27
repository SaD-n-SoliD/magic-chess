'use client';

import { Provider } from 'react-redux';
import store from '@/store';

type props = {
	children: React.ReactNode;
}

export function Providers({ children }: props) {
	return (
		<Provider store={store} >
			{children}
		</Provider>
	);
}
