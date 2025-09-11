import { Html, Head, Main, NextScript } from "next/document";

import { Images } from "../components/images"


const _document = () => {
  return (
    <Html lang="en">
        <Head>
            <link rel="icon" href={Images.FavIvon}/>
            <link rel="icon" type="image/png" href={Images.FavIvon} />
        </Head>
        <body>
            <Main/>
            <NextScript />
        </body>
    </Html>
  )
}

export default _document