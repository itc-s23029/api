import Head from 'next/head'
import { useState } from 'react'
import styles from '@/styles/Home.module.css'

export default function Home ({ results }) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = e => {
    setSearchQuery(e.target.value)
  }

  const filteredResults =
    results && results.shop
      ? results.shop.filter(data =>
          data.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : []

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h1>ホットペッパー 沖縄グルメサーチ</h1>
        <input
          type='text'
          placeholder='店舗を検索...'
          value={searchQuery}
          onChange={handleSearch}
        />
        <>
          {filteredResults.length > 0 ? (
            filteredResults.map((data, i) => (
              <li key={i}>
                {data.name}
                {/* 他の店舗情報もここに追加 */}
              </li>
            ))
          ) : (
            <li>No matching results</li>
          )}
        </>
      </main>
    </>
  )
}

// リクエストごとに呼び出されます。
export async function getServerSideProps () {
  const apiKey = process.env.API_KEY
  const baseUrl = 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/'
  const serviceArea = 'SA98' // サービスエリアを指定
  const format = 'json' // デフォルトがXMLフォーマットなのでJSONを指定

  // 外部APIからデータをFetchします。
  const res = await fetch(
    `${baseUrl}?key=${apiKey}&service_area=${serviceArea}&format=${format}`
  )

  if (!res.ok) {
    console.error(`Failed to fetch data. Status code: ${res.status}`)
    return { props: { results: null } }
  }

  const json = await res.json()
  const { results } = json

  // 上の方にあるHomeにpropsとしてデータが渡されます。
  return { props: { results } }
}
