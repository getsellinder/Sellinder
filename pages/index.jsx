import Head from 'next/head'
import SellinderLanding from '../components/SellinderLanding'
import HomePage from './home'

export default function Home() {
  return (
    <>
      <Head>
        <title>Sellinder — Know your customer before you meet</title>
      </Head>
      <SellinderLanding/>
      {/* <HomePage/> */}
    </>
  )
}
