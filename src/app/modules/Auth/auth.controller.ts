import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import config from "../../../config";



const refreshToken = catchAsync(async (req: Request, res: Response) => {

    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);


    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Access token generated successfully!",
        data: result
    })
});


const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId; // টোকেন থেকে প্রাপ্ত আইডি
    await AuthServices.changePassword(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Password changed successfully!",
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    await AuthServices.forgotPassword(req.body)


    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Check your email",
        data: null
    })
});


const resetPassword = catchAsync(async (req: Request, res: Response) => {

    const token = req.headers.authorization || "";


    await AuthServices.resetPassword(token, req.body)


    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Password reset successfully!",
        data: null
    })

})



const socialLogin = async (req: Request, res: Response) => {
    try {
        const result = await AuthServices.socialLogin(req.body);
        const { refreshToken, accessToken } = result;

        // সেট রিফ্রেশ টোকেন ইন কুকি
        res.cookie('refreshToken', refreshToken, {
            secure: config.env === 'production',
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully!",
            data: {
                accessToken,
                user: result.user
            }
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: error.message || "Social login failed"
        });
    }
};


export const AuthController = {
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword,
    socialLogin
}