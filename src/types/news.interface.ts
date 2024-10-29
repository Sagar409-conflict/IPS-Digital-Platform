export interface INews {
  id: string
  title: string
  news_description: string
  news_image: string
  status: string
  submittedAt: Date
  publishedAt: Date | null
}

export interface ICreateNews {
  id?: string
  title: string
  news_description: string
  news_image: string
  status?: string
  submittedAt?: Date
  publishedAt?: Date | null
}

export interface INewsResponse {
  id: string
  title: string
  news_description: string
  status: string
  submittedAt: Date
  publishedAt: Date | null
}

export interface INewsDetails {
  id: string
  title: string
  news_description: string
  status: string
}
