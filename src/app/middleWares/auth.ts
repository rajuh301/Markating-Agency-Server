import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpars/jwtHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {

        try {
            const token = req.headers.authorization

            if (!token) {
                throw new ApiError(401, "You are not authorized")
            }

            const verifyUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret)

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError(403, "Forbidden")
            }
            next()


        } catch (err) {
            next(err)
        }

    }

};


export default auth;