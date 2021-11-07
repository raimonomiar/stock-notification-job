export interface IPost {
    title: string,
    content: string,
    category: {
        categoryId: string,
        name?: string
    }
}