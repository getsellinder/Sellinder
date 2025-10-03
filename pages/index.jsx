import Head from 'next/head'
import SellinderLanding from '../components/SellinderLanding'
import HomePage from './home'
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <>
      <Head>
        <title>Sellinder — Know your customer before you meet</title>
        
      </Head>
      {/* <SellinderLanding/> */}
      <HomePage/>
        
    
    </>
  )
}
