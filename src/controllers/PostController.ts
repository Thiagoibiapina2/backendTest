import { Request, Response } from 'express'
import { prisma } from '../database/prisma'
import jwt, { Secret } from 'jsonwebtoken'

const JWT_SECRET = process.env.SECRET

declare module 'express' {
  export interface Request {
    decodedToken?: {
      id: string
      name: string
      email: string
      iat: number
    }
  }
}

export class PostController {
  async create(req: Request, res: Response) {
    const { title, content, published, authorId } = req.body

    // Verificar se os campos obrigatórios estão presentes e não vazios
    if (!title || !content || !title.trim() || !content.trim()) {
      return res.status(400).json({
        msg: 'Os campos "title", "content" e "public" são obrigatórios.',
      })
    }

    // Verificar se o authorId é um valor válido
    const user = await prisma.user.findUnique({ where: { id: authorId } })
    if (!user) {
      return res.status(400).json({ msg: 'O authorId fornecido não é válido.' })
    }

    const createdPost = await prisma.post.create({
      data: {
        title,
        content,
        published,
        author: { connect: { id: authorId } },
      },
    })

    if (!createdPost) {
      return res.status(500).json({ msg: 'Não foi possível criar o post.' })
    }

    return res
      .status(201)
      .json({ post: createdPost, msg: 'Post criado com sucesso.' })
  }

  async getAll(req: Request, res: Response) {
    const authorId = req.decodedToken ? req.decodedToken.id : undefined

    if (!authorId) {
      return res.status(400).json({ error: 'O authorId é obrigatório.' })
    }

    try {
      const Posts = await prisma.post.findMany({
        where: {
          authorId,
        },
      })

      return res.json(Posts)
    } catch (error) {
      return res
        .status(500)
        .json({ error, msg: 'Erro ao buscar os posts do usuário.' })
    }
  }

  async get(req: Request, res: Response) {
    const { id } = req.params

    try {
      const Posts = await prisma.post.findUniqueOrThrow({
        where: {
          id,
        },
      })

      if (!Posts) {
        return res.status(404).json({ error: 'Nenhum post encontrado.' })
      }

      return res.json(Posts)
    } catch (error) {
      return res
        .status(500)
        .json({ error: 'Erro ao buscar os posts do usuário.' })
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params
    const { title, content, published, authorId } = req.body

    // Verificar se os campos obrigatórios estão presentes e não vazios
    if (!title || !content || !title.trim() || !content.trim()) {
      return res.status(400).json({
        msg: 'Os campos "title", "content" e "public" são obrigatórios.',
      })
    }

    try {
      const updatedPost = await prisma.post.update({
        where: {
          id,
        },
        data: {
          title,
          content,
          published,
          author: { connect: { id: authorId } },
        },
      })

      return res.json({
        post: updatedPost,
        msg: 'Post atualizado com sucesso.',
      })
    } catch (error) {
      return res.status(500).json({ msg: 'Erro ao atualizar o post.' })
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params

    try {
      const deletePost = await prisma.post.delete({
        where: {
          id,
        },
      })

      return res.json({
        post: deletePost,
        msg: 'Post removido com sucesso.',
      })
    } catch (error) {
      return res.status(500).json({ msg: 'Erro ao deletar o post.' })
    }
  }
}

export default function verifyToken(req: Request, res: Response, next: any) {
  const token = req.headers.authorization

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Token de autenticação não fornecido.' })
  }

  try {
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      JWT_SECRET as Secret,
    ) as any
    req.decodedToken = decoded // Adiciona o token decodificado ao objeto req
    next()
  } catch (error) {
    return res
      .status(403)
      .json({ token, error: 'Token de autenticação inválido.' })
  }
}
