import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ZodError } from "zod";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    let message = "Something went wrong!";
    let errorSources: any = [];

    // ১. Zod Error হ্যান্ডেলিং (সবচেয়ে গুরুত্বপূর্ণ)
    if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Validation Error";
        errorSources = err.issues.map((issue) => {
            return {
                path: issue.path[issue.path.length - 1], // যেমন: 'items'
                message: issue.message, // যেমন: 'Expected string, received array'
            };
        });
    }
    // ২. Prisma Known Error
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = "Database Error";
        errorSources = [{ path: "", message: err.message }];
    }
    // ৩. কাস্টম এরর
    else if (err instanceof Error) {
        message = err.message;
        errorSources = [{ path: "", message: err.message }];
    }

    // রেসপন্স ফরমেট (HTML রিটার্ন বন্ধ করতে res.json ব্যবহার নিশ্চিত করুন)
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // শুধুমাত্র ডেভেলপমেন্ট মোডে স্ট্যাক দেখাবে
        stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined,
    });
};

export default globalErrorHandler;