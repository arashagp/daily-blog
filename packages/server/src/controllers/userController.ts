import { Request, Response } from "express";

import { prisma } from "../services/database.js";

export class User {
    static async createUser(req: Request, res: Response) {
        const { username, email, password } = req.body;

        if (username == null || password == null) {
            res.status(400).json({
                status: false,
                data: null,
                message: "Username and password are required",
            });
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

    static async getUser(req: Request, res: Response) {
        const id = parseInt(req.params.id);

        if (id == null) {
            res.status(400).json({
                status: false,
                data: null,
                message: "missed id Please Enter Your Id",
            });
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
}
