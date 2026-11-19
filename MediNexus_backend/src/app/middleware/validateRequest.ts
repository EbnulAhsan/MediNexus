// auth middleware ----

import z from "zod"
import { catchAsync } from "../utils/catchAsync"
import { Request, Response, NextFunction } from "express"




export const validateRequest = (zodschema: z.ZodObject) => {
    return catchAsync(
        (req: Request, _res: Response, next: NextFunction) => {



            const payload = req.body ?? {}

            const result = zodschema.safeParse(payload)

            if (!result.success) {
                console.log(result.error)
                console.log(result.error.issues)

                throw new Error(result.error.issues[0].message)
            }

            req.body = result.data


            next()





        }


    )

}