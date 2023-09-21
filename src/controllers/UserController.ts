import { Request, Response } from 'express'

import { prisma } from '../database/prisma'

// import bcrypt from 'bcrypt'

import jwt, { Secret } from 'jsonwebtoken'

import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.SECRET

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body

    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userExist) {
      return res.status(401).json({ msg: 'Usuario já existe' })
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })
      const token = jwt.sign(
        { id: user.id, name: user.name, email: user.email },
        JWT_SECRET as Secret,
      )

      return res
        .status(201)
        .json({ token, msg: 'usuario criado com sucesso', user })
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(401).json({ msg: 'User not found' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ msg: 'Invalid password' })
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      JWT_SECRET as Secret,
    )

    return res.status(201).json({ token, msg: 'sucesso' })
  }
}
