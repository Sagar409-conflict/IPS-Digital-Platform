export interface INewsCategory {
    id: string
    title: string
    icon_image: string 
    createdAt: Date
    updatedAt: Date
  }
  
  export interface ICreateNewsCategory {
    id?: string
    title: string
    icon_image:  string
    createdAt?: Date
    updatedAt?: Date
  }
  
  export interface INewsCategoryResponse {
    id: string
    title: string
    icon_image?: string
    createdAt: Date | null
    updatedAt: Date
  }
  
  export interface INewsCategoryDetails {
    id: string
    title: string
  }
  