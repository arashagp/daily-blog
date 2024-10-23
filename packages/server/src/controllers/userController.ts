import { NextFunction, Request, Response } from "express";

import { prisma } from "../services/database.js";
import { UserType } from "@monorepo/types";

export class User {
    static async createUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { username, email, password } = req.body;

        if (username == null || password == null) {
            res.status(400).json({
                status: false,
                data: null,
                message: "Username and password are required",
            });
            // TODO: Check to see this way can be work or not
            next();
            return;
        } else {
            let user;
            try {
                user = await prisma.user.create({
                    data: {
                        username,
                        password,
                        email: email ? email : null,
                    },
                });
            } catch (error) {
                if (error) {
                    res.status(500).json({
                        status: false,
                        data: null,
                        message: (error as Error).message,
                    });
                }
            }
            if (user !== null) {
                res.status(201).json({
                    status: true,
                    data: user,
                    message: "User created successfully",
                });
            }
        }
    }

    static async getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const id = parseInt(req.params.id);

        if (id == null) {
            res.status(400).json({
                status: false,
                data: null,
                message: "missed id Please Enter Your Id",
            });
            // TODO: Check to see this way can be work or not
            next();
            return;
        } else {
            let result;
            try {
                result = await prisma.user.findUnique({
                    where: {
                        id,
                    },
                    select: {
                        id: true,
                        username: true,
                        password: true,
                        email: true,
                    },
                });
            } catch (error) {
                if (error) {
                    res.status(500).json({
                        status: false,
                        data: null,
                        message: (error as Error).message,
                    });
                }
            }
            if (result == null) {
                res.status(404).json({
                    status: false,
                    data: null,
                    message: "User Not Found",
                });
                // TODO: Check to see this way can be work or not
                next();
                return;
            } else {
                res.status(200).json({
                    status: true,
                    data: result,
                    message: "User Fetch Successful",
                });
                return;
            }
        }
    }

    static async updateUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        const { username, email, password, posts } = req.body;
        const id = parseInt(req.params.id);

        let oldUser;
        let newUser: UserType = {} as UserType;

        try {
            oldUser = await prisma.user.findUnique({
                where: {
                    id,
                },
                select: {
                    email: true,
                    id: true,
                    password: true,
                    posts: true,
                    username: true,
                },
            });
        } catch (error) {
            if (error) {
                res.status(500).json({
                    status: false,
                    data: null,
                    message: (error as Error).message,
                });
            }
        }

        if (password !== null) {
            if (password === oldUser!.password) {
                res.status(400).json({
                    status: false,
                    data: null,
                    message: "Password is same as previous",
                });
                // TODO: Check to see this way can be work or not
                next();
            } else {
                newUser!.password = password;
            }
        } else {
            newUser!.password = oldUser!.password;
        }

        if (posts !== null) {
            res.status(400).json({
                status: false,
                data: null,
                message: "Posts can't be updated here",
            });
            // TODO: Check to see this way can be work or not
            next();
            return;
        }

        if (username !== null) {
            newUser!.username = username;
        } else {
            newUser!.username = oldUser!.username;
        }

        if (email !== null) {
            newUser!.email = email;
        } else {
            newUser!.email = oldUser!.email!;
        }

        try {
            const result = await prisma.user.update({
                where: {
                    id,
                },
                data: {
                    email: newUser.email,
                    password: newUser.password,
                    username: newUser.username,
                },
            });
            if (result !== null) {
                res.status(200).json({
                    status: true,
                    data: result,
                    message: "User Updated Successfully",
                });
            }
        } catch (error) {
            if (error) {
                res.status(500).json({
                    status: false,
                    data: null,
                    message: (error as Error).message,
                });
            }
        }
    }
}
