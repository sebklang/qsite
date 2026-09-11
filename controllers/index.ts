import { Request, Response, NextFunction } from 'express'

function indexGet(req: Request, res: Response, next: NextFunction) {
    // Test cookie
    res.render('index', { title: 'Express' })
}

export { indexGet }
