import { useRouter } from 'next/router';

export default function Dashboard() {
    const router = useRouter();

    return <h1 className='text-white text-3xl flex justify-center'>Dashboard: {router.query.walletAddress}</h1>;
}