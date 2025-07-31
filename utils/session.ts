import { NextFunction, Request, Response } from "express"




export const getSessionKey = (username: string) => `session:${username}`

export const wrapAsync = (fn: Function) => 
(req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);