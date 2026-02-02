export type SeatingSeat = { name: string; role?: string; suffix?: string } | string
export type SeatingTable = { name: string; group?: string; seats: SeatingSeat[]; leftCount?: number; pairWithNext?: boolean }
export type SeatingPlan = { headTable?: SeatingTable; tables: SeatingTable[] }
export type NoteItem = { title: string; body: string }
export type StoryboardItem = { id: string; label: string; title: string; subtitle?: string; image?: string; to?: string }
export type ProfileRow = { label: string; left: string | string[]; right: string | string[] }
export type ProfileInfo = {
  groom: { name: string; image?: string }
  bride: { name: string; image?: string }
  rows: ProfileRow[]
}
export type MessageInfo = { lines: string[]; date?: string; signature?: string }
export type PhotoShareInfo = {
  title: string
  subtitle?: string
  linkUrl?: string
  linkLabel?: string
}

export type EventConfig = {
  couple?: string
  eventDateIso?: string
  venueName?: string
  venueRoom?: string
  monogramUrl?: string
  seating?: SeatingPlan
  notes?: NoteItem[]
  photoShare?: PhotoShareInfo
  profile?: ProfileInfo
  message?: MessageInfo
  storyboard?: StoryboardItem[]
}

export const eventConfig: EventConfig = {
  couple: 'Tomoya & Mihono',
  eventDateIso: '2026-02-07',
  venueName: 'ザ・リッツ・カールトン大阪',
  monogramUrl: '/shared/favicon.png',
  seating: {
    tables: [
      {
        name: 'A',
        group: 'Glico同期',
        seats: [
          { role: '新郎新婦友人', name: '石原 大久' },
          { role: '新郎新婦友人', name: '中西 貴之' },
          { role: '新郎新婦友人', name: '小濱 直大' },
          { role: '新郎新婦友人', name: '出井 可奈子' },
          { role: '新郎新婦友人', name: '山崎 修平' },
          { role: '新郎新婦友人', name: '根本 博守' },
          { role: '新郎新婦友人', name: '加藤 瑞貴' },
          { role: '新郎新婦友人', name: '松井 理紗' }
        ]
      },
      {
        name: 'B',
        group: 'ともや唯一の友達',
        seats: [
          { role: '新郎友人', name: '北分 友貴' },
          { role: '新郎友人', name: '松本 愛洋' },
          { role: '新郎友人', name: '熊谷 将平' },
          { role: '新郎友人', name: '國本 駿' },
          { role: '新郎友人', name: '高祖 大地' },
          { role: '新郎友人', name: '藤原 幹太' }
        ]
      },
      {
        name: 'C',
        group: 'お茶大生',
        seats: [
          { role: '新婦友人', name: '佐野 七海' },
          { role: '新婦友人', name: '岡田 瑞穂' },
          { role: '新婦友人', name: '山田 美沙紀' },
          { role: '新婦友人', name: '香取 美果' },
          { role: '新婦友人', name: '上田 茉莉子' }
        ]
      },
      {
        name: 'D',
        group: '打瀬っ子',
        seats: [
          { role: '新婦友人', name: '吉松 絢子' },
          { role: '新婦友人', name: '池田 ありさ' },
          { role: '新婦友人', name: '堀場 芽衣' },
          { role: '新婦友人', name: '安田 恭子' },
          { role: '新婦友人', name: '伊藤 あかり' }
        ]
      },
      {
        name: 'E',
        group: '新郎親族',
        pairWithNext: true,
        seats: [
          { role: '新郎伯父', name: '三宅 一也' },
          { role: '新郎伯母', name: '三宅 俊恵' },
          { role: '新郎母', name: '三宅 一恵', suffix: '' },
          { role: '新郎伯父', name: '三宅 弘' },
          { role: '新郎父', name: '三宅 毅', suffix: '' }
        ]
      },
      {
        name: 'F',
        group: '新郎親族',
        seats: [
          { role: '新郎叔母', name: '林 美恵' },
          { role: '新郎従妹', name: '林 里咲' },
          { role: '新郎姉', name: '三宅 里穂', suffix: '' },
          { role: '新郎義兄', name: '三宅 雅大', suffix: '' },
          { role: '新郎甥', name: '三宅 快理', suffix: 'くん' },
          { role: '新郎姪', name: '三宅 柚', suffix: 'ちゃん' }
        ]
      },
      {
        name: 'G',
        group: '秀英生',
        seats: [
          { role: '新婦友人', name: '松澤 里奈' },
          { role: '新婦友人', name: '李 礼真' },
          { role: '新婦友人', name: '池田 阿佑美' }
        ]
      },
      {
        name: 'H',
        leftCount: 3,
        group: '新婦親族',
        seats: [
          { role: '新婦叔父', name: '河村 賢治' },
          { role: '新婦叔母', name: '河村 峰子' },
          { role: '新婦父', name: '小松 忠雄', suffix: '' },
          { role: '新婦従妹', name: '河村 朱音' },
          { role: '新婦従妹', name: '河村 真衣' },
          { role: '新婦祖母', name: '河村 豊子' },
          { role: '新婦母', name: '小松 京子', suffix: '' }
        ]
      }
    ]
  },
  notes: [
    {
      title: '写真撮影',
      body: '披露宴中の撮影は大歓迎です 写真や動画 たくさん撮って送ってください〜☺ 非日常空間なのでどこで撮ってもいい感じになると思います 全員とツーショット撮るのが目標です 高砂来て笑'
    },
    {
      title: '二次会',
      body: '全体での二次会はございません お披楽喜後にお茶したり飲みに行かれる方はぜひ場所をご連絡ください 顔出します どこに行けば…という場合はGlico同期に聞いてみてください きっと何か教えてくれるはず(優しい人達なので遠慮せず)'
    },
    { title: 'お食事', body: 'いっぱい食べていっぱい飲んでください 迷ったら好きなものからどうぞ' },
    { title: 'お席', body: '席次表でお席をご確認ください 迷ったらスタッフに声かけてね' },
    { title: '喫煙', body: '喫煙は決まった場所でお願いします 会場内は禁煙です' },
    { title: 'その他', body: 'その他 何か気になることがあれば スタッフの方にお声がけください' }
  ],
  photoShare: {
    title: '写真共有',
    subtitle: '撮影した写真をお送りいただけると嬉しいです'
  },
  profile: {
    groom: { name: '三宅 智也', image: '/pages/profile/groom.JPG' },
    bride: { name: '小松 美穂乃', image: '/pages/profile/bride.JPG' },
    rows: [
      { label: '生年月日', left: '1997.9.3', right: '1995.5.12' },
      { label: '血液型', left: 'A型', right: 'AB型' },
      { label: '出身地', left: '岡山県 玉野市', right: '千葉県 千葉市' },
      { label: '性格', left: 'おおぐらい', right: ['まけずぎらい', '※ドラクエ3より'] },
      { label: '特技', left: ['10時間睡眠', '(毎日)'], right: 'おやすみ3秒' },
      { label: '好きな食べ物', left: ['たまご きくらげ ', 'タルト'], right: 'ケーキ' },
      { label: '得意料理', left: ['お好み焼き', '(バイトしてた)'], right: 'パスタかな...' },
      { label: '第一印象', left: ['研修中', 'ヘドバンしてる人'], right: ['大きい', 'くまのぬいぐるみ'] },
      { label: '相手の好きなところ', left: '芯がある', right: ['とにかく優しい', 'よく笑う'] },
      { label: 'いつか一緒にしたいこと', left: ['世界一周', '(フェリーはNGらしい)'], right: ['インドでカレー食べる', '綺麗な星を見る'] }
    ]
  },
  message: {
    lines: [
      '本日はご多用のところお越しくださり',
      '誠にありがとうございます',
      '',
      'この日を迎えられましたのも',
      'ひとえに皆様のお力添えのおかげであり',
      '心より御礼申し上げます',
      '',
      '未熟なふたりですが 手を取り合い',
      '共に歩んでいきたいと思います',
      '',
      '今後とも末永いご指導とお付き合いのほど',
      '何卒よろしくお願いいたします',
      '',
      'ささやかではございますが',
      '楽しいひとときをお過ごしください'
    ],
    date: '2026年2月7日',
    signature: '三宅 智也・美穂乃'
  },
  storyboard: [
    { id: 'seating', label: 'Seating', title: '席次表', subtitle: '席次表の確認', image: '/pages/seating/ritz-lounge.JPG', to: '/seating' },
    { id: 'notes', label: 'Notes', title: 'お願い', subtitle: '当日のご注意', image: '/pages/notes/story-2.jpg', to: '/notes' },
    { id: 'profile', label: 'Profile', title: 'プロフィール', subtitle: '新郎新婦のご紹介', image: '/pages/profile/two.JPG', to: '/profile' },
    { id: 'message', label: 'Message', title: 'メッセージ', subtitle: 'ご挨拶', image: '/pages/message/IMG_5206.jpg', to: '/message' },
    { id: 'fav-1', label: 'Favorites', title: '推しの写真①', subtitle: 'Tomoya', image: '/pages/favorites-1/201579_0.jpg', to: '/favorites-1' },
    { id: 'fav-2', label: 'Favorites', title: '推しの写真②', subtitle: 'Mihono', image: '/pages/favorites-2/IMG_8799.jpg', to: '/favorites-2' },
    { id: 'photos', label: 'Photos', title: '写真共有', subtitle: '撮影した写真を送る', image: '/pages/photos/story-4.jpg', to: '/photos' },
    { id: 'guide', label: 'Extras', title: '？', subtitle: 'お楽しみコーナー', image: '/pages/guide/night-1.jpg', to: '/guide' },
    { id: 'thanks', label: 'Thanks', title: '？', subtitle: '導入して良かったもの', image: '/pages/thanks/IMG_4922.jpg', to: '/thanks' }
  ]
}
