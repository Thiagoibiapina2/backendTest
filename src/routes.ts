import { Router } from 'express'
import { UserController } from './controllers/UserController'
import verifyToken, { PostController } from './controllers/PostController'

const router = Router()

const createUser = new UserController()
const Post = new PostController()

// Login
router.post('/auth', (req, res) => createUser.login(req, res))

// Criar usuário
router.post('/User', (req, res) => createUser.create(req, res))

// Criar post
router.post('/Post', (req, res) => Post.create(req, res))

// Atualizar post
router.put('/Post/:id', (req, res) => Post.update(req, res))

// Deletar post
router.delete('/Post/:id', (req, res) => Post.delete(req, res))

// Pegar todos os  posts referentes ao usuário
router.get('/Post', verifyToken, Post.getAll)

router.get('/Post/:id', Post.get)

export default router
