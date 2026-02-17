import { Request, Response } from 'express';
import { UserService } from './user.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await UserService.createUser(req.body);
    const { password, ...userWithoutPassword } = result;

    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: userWithoutPassword,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await UserService.findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password!))) {
      res.status(401).json({ message: "Email and password not match" });
      return; 
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
    try {
       
        const organizationId = (req as any).user.organizationId; 
        
        const result = await UserService.getAllUsers(organizationId);

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const inviteUser = async (req: Request, res: Response) => {
    try {
        const result = await UserService.inviteUser(req.body);
        res.status(201).json({
            success: true,
            message: "User invited successfully",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const setPassword = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const result = await UserService.setPassword(email, password);
        
        res.status(200).json({
            success: true,
            message: "Password set successfully! You can now login.",
            data: result
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId; 
        
        const result = await UserService.getMyProfile(userId);

        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: result
        });
    } catch (error: any) {
        res.status(401).json({ success: false, message: "Unauthorized access" });
    }
};



export const UserController = {
  register,
  login,
  getAllUsers,
  inviteUser,
  setPassword,
  getMyProfile
};