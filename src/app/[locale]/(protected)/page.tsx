import { redirect } from 'next/navigation';

import { NextPage } from 'next';

const ProtectedPage: NextPage = () => redirect('/dashboard');

export default ProtectedPage;
