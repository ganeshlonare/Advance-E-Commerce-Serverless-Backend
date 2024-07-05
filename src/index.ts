import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string
  }
}>()

app.all('/api/signup',async (c)=>{
  const body = await c.req.json()  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app  