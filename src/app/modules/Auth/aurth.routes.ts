import exporee from "express"
import { AuthController } from "./auth.controller";
import auth from "../../middleWares/auth";
import { UserRole } from "@prisma/client";
import { ENUM_USER_ROLE } from "../enums/user";

const router = exporee.Router();

router.post("/refresh-token", AuthController.refreshToken)

router.patch(
  '/change-password',
  auth(ENUM_USER_ROLE.OWNER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.MEMBER),
  AuthController.changePassword
);

// গুগল এবং অ্যাপল লগইন (একই এন্ডপয়েন্ট দিয়ে হ্যান্ডেল করা হচ্ছে)
router.post('/social-login', AuthController.socialLogin);

router.post("/forgot-password", AuthController.forgotPassword)

router.post("/reset-password", AuthController.resetPassword)

export const AuthRouter = router;