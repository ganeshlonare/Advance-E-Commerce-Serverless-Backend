import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

const app = new Hono<{
  Bindings:{
    DATABASE_URL:string
  }
}>()

app.post('/api/signup',async (c)=>{
  const body = await c.req.json()  
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
  try {
    const user = await prisma.user.create({
      data:{
        name:body.name,
        email:body.email,
        password:body.password
      }
    })

    return c.json({
      success : true,
      message:"user registered successfully",
      user
    })
  } catch (error : any) {
    console.log("error in signup")
    console.log(error.message)
    return c.json({
      success : false,
      message:error.message
    })
  }
})

app.post('/api/signin', async(c)=>{
  const body = await c.req.json()
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try {
      const {email , password} = body
      const user = await prisma.user.findUnique({
        where:{
          email:email
        }
      })
      if(!user){
        return c.json({
          success : false,
          message:"user not found"
        })
      }

      return c.json({
        success:true,
        message:"user logged in successfully",
        user
      })
    } catch (error:any) {
      console.log("error in signin")
      console.log(error.message)
      return c.json({
      success : false,
      message:error.message
      })
    }
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app  