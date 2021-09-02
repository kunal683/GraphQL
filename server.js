const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP
const app = express()
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]




const authordetais = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents a author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books :{
            type : new GraphQLList(BookType),
            resolve : (author)=>{
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})




const BookType = new GraphQLObjectType({
    name: 'books',
    description: 'This represents a book written by an author',
    fields: () => ({
      id: { type: GraphQLNonNull(GraphQLInt)},
      name : {type : GraphQLNonNull(GraphQLString)},
        authorId : {type : GraphQLNonNull(GraphQLInt)},
        author : {
            type :   authordetais,
            description : "name of the author",
            resolve : (books)=> {
               return authors.find(author  => author.id === books.authorId)
            }
        }
    })
  })

  
  


const roottype = new GraphQLObjectType({
    name : 'query',
    description : 'root query',
    fields : ()=>({
        book:{
            type : BookType,
            description : 'a single book',
            args :{
                id : {type : GraphQLInt}
            },
            resolve : (parent,args)=>{ 
                return books.find(book =>book.id === args.id)
            }
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
          },
        authors :{
            type : new GraphQLList(authordetais),
            description : 'list of all authors',
            resolve: ()=> authors
        }
    })
})


const rootmutation = new GraphQLObjectType({
    name : 'mutation',
    description : 'add your author or book',
    fields : () =>({
        addbooks :{
            type : BookType,
            args : {
                
                name : {type : GraphQLString},
                authorId : {type : GraphQLInt}
            },
            resolve : (parents,args)=>{
                const newbook = {id : books.length + 1, name : args.name, authorId : args.authorId}
                books.push(newbook)
                return newbook
            }
        },
        addauthor :{
            type : authordetais,
            args : {
                
                name : {type : GraphQLString},
            },
            resolve : (parents,args)=>{
                const newauthor = {id : authors.length + 1, name : args.name}
                authors.push(newauthor)
                return newauthor
            }
        }
    })
})


const schema = new GraphQLSchema({
    query : roottype,
    mutation : rootmutation
})


app.use('/graphql',expressGraphQL({
    schema : schema,
    graphiql : true,
}))
app.listen(process.env.port|| 3000,()=>{
    console.log("server is running ")
})



